
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MessageRepository(DataContext context, IMapper mapper) : IMessageRepository
    {
        public void AddGroup(Group group)
        {
            context.Groups.Add(group);
        }

        public void AddMessage(Message message)
        {
            context.messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            context.messages.Remove(message);
        }

        public async Task<Connection?> GetConnection(string connectionId)
        {
            return await context.Connections.FindAsync(connectionId);
        }

        public async Task<Group?> GetGroupForConnection(string connectionId)
        {
            return await context.Groups
                .Include(c => c.Connections)
                .Where(c => c.Connections.Any(x => x.ConnectionId == connectionId))
                .FirstOrDefaultAsync();
        }

        public async Task<Message?> GetMessage(int id)
        {
            return await context.messages.FindAsync(id);
        }

        public async Task<Group?> GetMessageGroup(string groupName)
        {
            return await context.Groups
                .Include(x => x.Connections)
                .FirstOrDefaultAsync(x => x.Name == groupName); 
        }

        public async Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = context.messages
                .OrderByDescending(x => x.MessageSent)
                .AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(x => x.Recipient.UserName == messageParams.Username 
                && x.RecipientDeleted == false),
                "Outbox" => query.Where(x => x.Sender.UserName == messageParams.Username
                && x.SenderDeleted == false),
                _ => query.Where(x => x.Recipient.UserName ==
                        messageParams.Username && x.DateRead == null 
                        && x.RecipientDeleted == false)
            };

            var messages = query.ProjectTo<MessageDto>(mapper.ConfigurationProvider);

            return await PagedList<MessageDto>
                .CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recipientUsername)
        {
            var query = context.messages
                .Where(x => 
                    x.RecipientUsername  == currentUsername 
                    && x.RecipientDeleted ==false
                    && x.SenderUsername == recipientUsername || 
                    x.SenderUsername == currentUsername 
                    && x.SenderDeleted == false
                    && x.RecipientUsername == recipientUsername  
                    
                )
                .OrderBy(x => x.MessageSent)
                .AsQueryable();

            var unreadMessages = query.Where(x => x.DateRead == null && 
                                                x.RecipientUsername == currentUsername).ToList();

            if (unreadMessages.Count != 0)
            {
                unreadMessages.ForEach(x => x.DateRead = DateTime.UtcNow);
                
            }

            return await query.ProjectTo<MessageDto>(mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public void RemoveConnection(Connection connection)
        {
            context.Connections.Remove(connection);
        }
    }
}
