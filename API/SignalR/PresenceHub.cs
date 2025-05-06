using System;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

[Authorize]
    public class PresenceHub(PresenceTracker presenceTracker) : Hub
    {
        public override async Task OnConnectedAsync()
        {
            if (Context.User == null) throw new HubException("Cannot get current user claims");

            await presenceTracker.UserConnected(Context.User.GetUsername(), Context.ConnectionId);
            await Clients.Others.SendAsync("UserIsOnline", Context.User?.GetUsername());

            var onlineUsers = await presenceTracker.GetOnlineUsers();
            await Clients.Caller.SendAsync("GetOnlineUsers", onlineUsers);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            if (Context.User == null) throw new HubException("Cannot get current user claims");
            
            await presenceTracker.UserDisconnected(Context.User.GetUsername(), Context.ConnectionId);
            await Clients.Others.SendAsync("UserIsOffline", Context.User?.GetUsername());

            var onlineUsers = await presenceTracker.GetOnlineUsers();
            await Clients.Caller.SendAsync("GetOnlineUsers", onlineUsers);

            await base.OnDisconnectedAsync(exception);
        }
    }
