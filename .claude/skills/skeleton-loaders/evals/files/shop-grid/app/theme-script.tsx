// Sets the .dark class on <html> before paint from the saved preference.
export function ThemeScript() {
  const js = `try{if(localStorage.theme==="dark")document.documentElement.classList.add("dark")}catch(e){}`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
