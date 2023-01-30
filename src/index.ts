// Import only the apis you need
import { youtube } from "@googleapis/youtube";

// Import environment from .env file
import dotenv from 'dotenv';
dotenv.config()

// Initialise and authenticate the youtube api client
const youtubeApi = youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

async function getAllVideoUploads() {
  // Fetch details for all channels given the username
  const channelResponse = await youtubeApi.channels.list({
    // Alternative to the username you can specify channel-ids directly
    // id: ["CHANNEL_ID_HERE"]
    // I'll go for an easy example here
    forUsername: "CGPGrey",
    part: ["contentDetails"],
  })

  // Check if we found something
  const items = channelResponse.data.items;
  if (!items || items.length <= 0) throw Error("Channel not found");

  // Extract the playlistId describing the uploads of that channel
  const playlistId = items[0].contentDetails?.relatedPlaylists?.uploads

  // Now fetch all items of this playlist
  const playlistResponse = await youtubeApi.playlistItems.list({
    playlistId,
    maxResults: 10,
    part: ["snippet"]
  })

  // For testing lets output the latest 10 videos of the channel
  playlistResponse.data.items?.forEach(playlistItem => {
    console.log(playlistItem.snippet?.title)
  })
}

// Call the asynchronous function
getAllVideoUploads();
