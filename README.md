# Minimal

The YouTube API allows developers to integrate YouTube functionality into their applications, such as retrieving information on videos, channels, playlists, comments, and captions. In a TypeScript and Node.js environment, the API can be used to:

- Build custom YouTube players
- Retrieve video and channel statistics
- Search and retrieve videos, playlists and channels
- Manage and update user's own YouTube channel
- Automate video uploads and video management

Using the API in a TypeScript and Node.js environment allows for more control and customization of the YouTube experience, as well as automating tasks and improving efficiency.

## Let us take a look at how its done

[Jump right to the finished script](src/index.ts)

### Import only the apis you need

```typescript
import { youtube } from "@googleapis/youtube";
```

### Initialise and authenticate the youtube api client

```typescript
const youtubeApi = youtube({
  version: "v3",
  auth: "YOUR_API_KEY_GOES_HERE",
});
```

### Fetch details for all channels given the username

```typescript
const channelResponse = await youtubeApi.channels.list({
  // Alternative to the username you can specify channel-ids directly
  // id: ["CHANNEL_ID_HERE"]
  // I'll go for an easy example here
  forUsername: "CGPGrey",
  part: ["contentDetails"],
});
```

### Check if we found something

```typescript
const items = channelResponse.data.items;
if (!items || items.length <= 0) throw Error("Channel not found");
```

### Extract the playlistId describing the uploads of that channel

```typescript
const playlistId = items[0].contentDetails?.relatedPlaylists?.uploads;
```

### Now fetch all items of this playlist

```typescript
const playlistResponse = await youtubeApi.playlistItems.list({
  playlistId,
  maxResults: 10,
  part: ["snippet"],
});
```

### For testing lets output the latest 10 videos of the channel

```typescript
playlistResponse.data.items?.forEach(playlistItem =>
  console.log(playlistItem.snippet?.title)
)
```

## Pitfalls

You should never import the `googleapis` dependency itself. It is far too huge and will slow down your build tremendously if you are using typescript.
