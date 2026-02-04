# How to fix "ERR_QUIC_PROTOCOL_ERROR" (Browser Fix)

If you have already updated the server but still see the error, your browser is "remembering" the broken protocol.

## Method 1: Incognito Mode (Easiest)
1. Open a **New Incognito Window** (Ctrl+Shift+N).
2. Visit `https://businesstalkwithdeepakbhatt.com/admin`
3. If it works here, the server is fixed, and your main browser just needs to clear its cache.

## Method 2: Disable QUIC in Chrome
1. Open a new tab and type: `chrome://flags`
2. Search for **"Experimental QUIC protocol"**
3. Change it from "Default" to **"Disabled"**
4. Click **Relaunch** at the bottom.

## Method 3: Clear QUIC Cache (Without disabling)
1. Open a new tab and type: `chrome://net-internals/#dns`
2. Click **"Clear host cache"**
3. Go to `chrome://net-internals/#sockets`
4. Click **"Flush socket pools"**
5. Try accessing the site again.

## Verify Server Fix
You must have applied the `nginx.conf` changes on your VPS for this to be a permanent fix for all users.
1. SSH into VPS
2. Copy content of `nginx.conf` to `/etc/nginx/sites-available/business-talk`
3. Run `systemctl restart nginx`
