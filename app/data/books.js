export const BOOK_CONTENTS = {
  // ID 1: HTML
  "1": [
    { 
      page: 1, 
      text: "🏗️ HTML: The Structural Foundation\n\nHTML (HyperText Markup Language) is the skeleton of every web project. Beyond the basics, understanding the DOM (Document Object Model) tree is vital. When a browser loads your HTML, it creates a hierarchical model where every element is a node. This structure allows scripts to dynamically access and update the content, structure, and style of a document.\n\nModern development requires a deep understanding of the HTML5 Specification. The global structure begins with the <!DOCTYPE html> declaration, which ensures the browser renders in 'Standards Mode' rather than 'Quirks Mode.' This is followed by the <html> root, the <head> containing metadata, and the <body> containing the visible content. Mastering attributes like 'lang' for accessibility and 'charset' for character encoding is essential for global-ready applications." 
    },
    { 
      page: 2, 
      text: "🏷️ Semantic Elements & Text Layout\n\nUsing semantic tags like <main>, <section>, and <article> is not just about clean code; it’s about 'Machine Readability.' Search engines and assistive technologies rely on these markers to understand the priority of information. For instance, using <nav> helps screen readers skip directly to navigation, while <aside> indicates content that is tangentially related to the main text.\n\nText organization has evolved. Beyond <h1>-<h6> and <p> tags, we now utilize <figure> for self-contained content and <figcaption> for descriptions. For technical documentation, tags like <code>, <pre>, and <kbd> provide semantic meaning to snippets of code. In data-heavy apps, tables must be structured with <thead>, <tfoot>, and <tbody> to ensure that data remains parsable and accessible even when exported or transformed." 
    },
    { 
      page: 3, 
      text: "📩 Interactive Components & Modern Media\n\nInteractive forms are the backbone of user engagement. Beyond simple inputs, modern HTML5 offers specialized types like 'tel', 'url', 'number', and 'date' which trigger specific mobile keyboards, improving the mobile UX. Use the <datalist> element to provide 'autocomplete' suggestions for input fields without needing complex JavaScript libraries.\n\nMedia handling has been revolutionized by the <picture> and <source> elements. These allow for 'Responsive Images' where the browser chooses the best file based on screen resolution or format support (like WebP vs JPEG). For high-performance vector graphics, SVG is preferred over raster images as it is resolution-independent and can be styled directly with CSS, making it perfect for icons and complex illustrations. 🎨" 
    },
    {
      page: 4,
      text: "⚡ Advanced Performance & Web APIs\n\nHTML now interfaces directly with powerful browser APIs. The <canvas> element allows for pixel-level manipulation and 2D/3D rendering, essential for web-based gaming and data visualization. Meanwhile, the <dialog> element provides a native, accessible way to create modal dialogs and popovers, handling focus management automatically—a task that previously required dozens of lines of JavaScript.\n\nPerformance optimization starts at the HTML level. Using the 'loading=lazy' attribute on images and iframes significantly reduces initial load times by deferring off-screen content. Furthermore, resource hints like 'rel=preload' and 'rel=preconnect' allow developers to tell the browser which assets are high priority, ensuring the critical rendering path is as fast as possible for the end user. 🚀"
    }
  ],

  // ID 2: CSS
  "2": [
    { 
      page: 1, 
      text: "🎨 CSS: Style and Layout Mastery\n\nCSS (Cascading Style Sheets) is responsible for the visual layer. To master it, one must grasp 'Specificity'—a weight assigned to selectors that determines which rule is applied. A common pitfall for developers is over-using the !important flag, which breaks the natural cascade and makes debugging difficult. Instead, focus on using consistent class-based naming conventions like BEM.\n\nThe Box Model is the most critical concept in CSS. Every element is a rectangular box comprising content, padding, border, and margin. Understanding how 'box-sizing: border-box' changes the math of your layout is fundamental to building predictable interfaces. Without it, adding padding to an element increases its total width, often breaking grid alignments and causing horizontal overflow issues." 
    },
    { 
      page: 2, 
      text: "🔡 Typography & Advanced Layout Engines\n\nTypography is more than just picking a font. It involves managing vertical rhythm through line-height and letter-spacing. Modern CSS allows for 'Variable Fonts,' where a single file contains multiple weights and styles, reducing HTTP requests. Using relative units like 'vh', 'vw', and 'ch' alongside 'rem' ensures that your typography scales beautifully across different screen sizes.\n\nLayout engines have moved from Floats to Flexbox and Grid. Flexbox is optimized for 1-dimensional layouts (rows or columns), while CSS Grid is designed for 2-dimensional layouts. The 'gap' property, now supported in both engines, has simplified spacing by removing the need for 'margin-right' on items. Mastering the 'fr' unit in Grid allows for fluid, fractional layouts that are impossible to achieve with percentages alone. 🕸️" 
    },
    { 
      page: 3, 
      text: "📱 Responsive Design & State Logic\n\nResponsive design is now 'Mobile-First.' We write the base styles for small screens and use Media Queries to add complexity for desktops. However, modern CSS is moving toward 'Container Queries,' allowing a component to change its style based on the size of its parent container rather than the entire viewport. This makes components truly modular and reusable across different sections of an app.\n\nTransitions and Animations add life to the UI. Use the 'transform' and 'opacity' properties for animations as they are GPU-accelerated and don't trigger 'Layout Reflows.' This ensures 60fps performance even on lower-end mobile devices. Pseudo-classes like :focus-within and :hover allow for rich interactivity without a single line of script, keeping the browser's main thread free for logic. 🎢" 
    },
    {
      page: 4,
      text: "🏢 CSS Architecture & Future Spec\n\nLarge-scale projects require a systematic approach. CSS Variables (Custom Properties) allow for centralized tokens like --brand-primary or --spacing-unit. This enables features like instant Dark Mode by simply swapping variable values at the :root level. In professional environments, preprocessors like Sass or PostCSS are used to automate repetitive tasks and polyfill future CSS features for older browsers.\n\nThe future of CSS includes functions like clamp(), which allows for fluid values that stay within a range, and color-mix(), which lets you blend colors directly in the stylesheet. As the 'Interoperability' of browsers improves, advanced features like 'Subgrid' are becoming standard, allowing nested elements to align perfectly with the parent's grid lines, solving one of the oldest challenges in web design. 💎"
    }
  ],

  // ID 3: JavaScript
  "3": [
    { 
      page: 1, 
      text: "🧠 JavaScript: The Logic of the Web\n\nJavaScript is the only language that runs natively in every browser. It has evolved from a simple scripting tool to a powerful, multi-paradigm language. Understanding 'Hoisting' and the 'Temporal Dead Zone' is crucial when using let and const. These modern keywords prevent the common 'variable leaking' issues found with var by enforcing block-level scope.\n\nData structures in JS go beyond just Objects and Arrays. Modern ES6+ introduced 'Map' for better key-value pair handling and 'Set' for storing unique values. Array methods like .reduce() are incredibly powerful; they can transform an array into a single value, an object, or even another array, making them the Swiss Army knife of data manipulation in modern functional programming patterns." 
    },
    { 
      page: 2, 
      text: "📞 Functions, Scope & The Prototype Chain\n\nFunctions are 'First-Class Citizens' in JavaScript, meaning they can be passed as arguments, returned from other functions, and assigned to variables. Arrow functions changed the game by offering a shorter syntax and, more importantly, lexical 'this' binding. This solves the classic problem where 'this' would lose its context inside callbacks or nested functions.\n\nUnder the hood, JavaScript uses 'Prototypal Inheritance.' Unlike class-based languages like Java, JS objects inherit directly from other objects. While the 'class' keyword was introduced in ES6, it is mostly 'syntactic sugar' over the prototype chain. Understanding this is key to managing memory efficiently, as methods defined on a prototype are shared across all instances rather than being recreated for every object created. 🧩" 
    },
    { 
      page: 3, 
      text: "⏳ Asynchronous JS & The Event Loop\n\nJavaScript is single-threaded, yet it handles thousands of concurrent operations. This is made possible by the 'Event Loop.' When an asynchronous task like a network request starts, it is moved to a background thread. Once finished, the result is placed in the 'Callback Queue' and pushed back to the main thread only when it's free. This prevents the UI from 'janking' or freezing during heavy data fetching.\n\nThe transition from Callbacks to Promises and finally to async/await has made code much more readable. The 'try/catch' block used with async functions allows for robust error handling that looks and feels like synchronous code. This is vital when working with the Fetch API to interact with REST or GraphQL endpoints, ensuring that users receive helpful feedback even when a network request fails. ⚡" 
    },
    {
      page: 4,
      text: "🏛️ Modern Architecture & Tooling\n\nModern JS development is built on 'Modules.' By using import and export, we can break a project into tiny, testable pieces. This modularity is what enables 'Tree Shaking'—a process where build tools like Webpack or Vite remove unused code from your final bundle, significantly reducing the file size sent to the user's browser.\n\nBeyond the browser, JavaScript's reach is massive. Runtimes like Node.js and Bun allow JS to run on servers, while frameworks like React Native and Electron allow us to build mobile and desktop apps with the same codebase. Concepts like 'Immutability' and 'Pure Functions' from functional programming are now standard in state management libraries like Redux or Zustand, ensuring that application state changes are predictable and easy to debug. 🌍"
    }
  ],
};