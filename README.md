# RetroShell Interactive Portfolio

This is a Next.js-based interactive portfolio designed to look and feel like a retro desktop operating system. 

## Features

- **Interactive Desktop UI:** Draggable icons and resizable, draggable windows.
- **Retro Theme:** Styled with Tailwind CSS and CSS variables for easy theming.
- **Component-Based:** Built with React and Next.js App Router.
- **Fully Dynamic Content:** Easily manage all portfolio items, articles, and terminal commands by editing simple JSON and Markdown files.
- **Static Site Generation:** Optimized for performance and easy hosting.
- **Responsive Design:** Adapts for a seamless experience on mobile devices.

## Getting Started

To run the portfolio locally, follow these steps:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```

3.  Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Customization Guide

This portfolio is designed to be highly customizable. All content is managed through JSON configuration files in `src/data/` and Markdown content files in `public/content/`.

### 1. Changing the Theme

You can change the color scheme of the entire UI by editing the CSS variables in `src/app/globals.css`. The colors are defined using HSL values.

```css
@layer base {
  :root {
    --background: 240 100% 6%; /* Hue, Saturation, Lightness */
    --foreground: 81 91% 53%;
    --primary: 81 91% 53%;
    /* ... and so on */
  }
}
```

### 2. Managing Desktop Icons & Windows

To add, remove, or modify the desktop icons and the windows they open, you only need to edit two places:

1.  **Edit the Data File:** Open `src/data/portfolio-data.json`. Each object in the `items` array represents a desktop icon.

    ```json
    {
      "items": [
        {
          "id": "about",
          "title": "About Me",
          "icon": "User",
          "defaultSize": { "width": 500, "height": 350 },
          "filePath": "content/portfolio-items/about.md"
        }
      ]
    }
    ```

    - `id`: A unique identifier.
    - `title`: The name displayed under the icon and in the window title bar.
    - `icon`: The name of any icon from the [Lucide icon library](https://lucide.dev/icons/). For example, `Rocket`, `Briefcase`, `Mail`.
    - `defaultSize`: The initial width and height of the window when it opens.
    - `filePath`: The path to the Markdown file that contains the content for this window, relative to the `public` directory.

2.  **Create the Content File:** Create a new Markdown (`.md`) file inside the `public/content/portfolio-items/` directory. The name should match the `filePath` you defined in the JSON file.

That's it! The app will dynamically load the new item.

### 3. Managing Articles

The "Articles" application works similarly.

1.  **Edit the Data File:** Open `src/data/articles-data.json`. You can add new topics or add new articles to existing topics.

    ```json
    {
      "topics": [
        {
          "id": "tech-guides",
          "title": "Tech Guides",
          "articles": [
            {
              "id": "my-first-article",
              "title": "My First Article",
              "summary": "An introduction to dynamic content.",
              "filePath": "content/articles/my-first-article.md"
            }
          ]
        }
      ]
    }
    ```
    - `filePath`: The path to the article's Markdown file, relative to the `public` directory.

2.  **Create the Content File:** Create the corresponding `.md` file inside the `public/content/articles/` directory.

### 4. Customizing Terminal Commands

You can add or modify terminal commands by editing `src/data/commands.json`.

```json
{
  "commands": [
    {
      "command": "about",
      "description": "Display information about me.",
      "type": "component",
      "content": "about"
    },
    {
      "command": "help",
      "description": "Show this help message.",
      "type": "special",
      "content": "help"
    }
  ]
}
```

-   `command`: The command string the user types.
-   `description`: The text shown in the `help` command output.
-   `type`:
    -   `component`: Renders the content of a portfolio item directly in the terminal. The `content` field must match the `id` of an item in `portfolio-data.json`.
    -   `text`: Prints the `content` string directly to the terminal.
    -   `special`: For built-in commands like `help`, `date`, or `clear`.
-  `content`: The value associated with the command's `type`.