# Sync Dyn Config

**Sync Dyn Config** is a plugin for Vite that allows you to dynamically inject configurations into the generated HTML file. It supports conditional inclusion via SSI (Server Side Includes).

**⭐ This allows you to have :**
- **Synchronous config**: Thanks to the injection into the page
- **A unique package from local to production**: With SSI nginx

## 🚀 Installation

You can install this plugin via npm:

```bash
npm install vite-sync-dyn-config
```

or via yarn:

```bash
yarn add vite-sync-dyn-config
```

## 📖 Usage

Add the plugin to your Vite configuration file (`vite.config.js` or `vite.config.ts`).

```javascript
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'sync-dyn-config';

export default defineConfig({
  plugins: [
    createSyncDynConfig({
      SSI: {
        enable: true,
        path: '/config/default.json'
      },
      values: { 
        foo: 'bar' 
      },
      injectedVarName: 'window.MyCustomConfig'
    })
  ]
});
```

For the use of SSI, you need your nginx to have the directive `ssi on;` and a file at the URL `/config/default.json` (example URL).

## ⚙️ Options

The plugin accepts a partial options object to customize its behavior. Here are the available options:

- **SSI**: Object containing the Server Side Includes settings.
    - `enable` (boolean): Enables or disables the use of SSI. Default: `false`
    - `path` (string): Path to the SSI configuration file. Default: `'config.json'`
- **values**: The values to inject into the HTML. Default: `{}`
- **injectedVarName**: The name of the variable injected into the HTML. Default: `'window.CONFIG'`

## 💡 Example

With the following configuration in :

`vite.config.ts`

```javascript
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'sync-dyn-config';

export default defineConfig({
  plugins: [
    createHtmlPlugin({
      SSI: {
        enable: true,
        path: '/config/default.json'
      },
      values: { 
        apiUrl: 'https://api.example.com'
      },
      injectedVarName: 'window.AppConfig'
    })
  ]
});
```

`nginx.conf`

```nginx
server {
    listen 80;
    root /var/www/your-site;
    location / {
        ssi on; # 🫵 SSI ON
        try_files $uri $uri/ /index.html;
    }
    location /config {
        alias /config/default.json; 
    }
}
```


The plugin will generate the following code in the HTML file:

```html
<!--#set var="$SSI_VITE_CONFIG" value="1" -->
<!--# if expr="$SSI_VITE_CONFIG = 1" -->
    <!--# include virtual="/path/to/ssi-config.json" -->
<!--# else -->
<script>
    window.AppConfig = {"apiUrl":"https://api.example.com"};
</script>
<!--# endif -->
```

Without SSI enabled, it will simply generate:

```html
<script>
    window.AppConfig = {"apiUrl":"https://api.example.com"};
</script>
```
