export default function ThemeScript() {
  const themeScript = `
    (function() {
      function getTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
          return savedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      
      const theme = getTheme();
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    })();
  `

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: themeScript,
      }}
    />
  )
}