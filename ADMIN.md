# Admin Panel Setup

The United Studio Collective site now has an admin panel for managing videos on the filmmaking page.

## Access

The admin panel is available at: `/admin/videos`

## How It Works

The admin panel works entirely in the browser and communicates directly with GitHub's API. When you save changes:

1. Changes are committed to the `app/filmmaking/videos.json` file in your GitHub repository
2. The commit triggers the GitHub Actions deployment workflow
3. The site rebuilds and deploys automatically

## Login

To access the admin panel, you'll need:

1. **Admin Password**: `usc2024` (default)
2. **GitHub Personal Access Token**: A token with `repo` scope

### Creating a GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name like "USC Site Admin"
4. Select the `repo` scope (this gives full control of private repositories)
5. Click "Generate token"
6. Copy the token - you'll need it to login

**Important:** Store your token securely. Don't share it with others.

## Features

- **Drag and drop** to reorder videos (first video is the hero)
- **Edit** video titles, descriptions, duration, creator
- **Add** YouTube videos by URL (auto-fetches title and thumbnail)
- **Hide/show** videos without deleting them
- **Delete** videos
- **Set hero video** with the crown icon
- Changes are saved directly to GitHub via API

## Configuration

The admin panel comes pre-configured for the `banddude/united-studio-collective` repository.

If you need to change the repository settings, click "Show GitHub Config" on the login page to modify:
- Repository owner
- Repository name
- Branch name

## Security Notes

- Your GitHub token is stored in your browser's localStorage
- Never share your token or password
- The token is only sent to GitHub's API, not to any other servers
- Consider using a separate GitHub account with limited permissions for the token
