function Header() {
    return (
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <a href="/">Letras Cristianas</a>
          </h1>
          <nav>
            <a href="/" className="hover:underline">Inicio</a>
            {/* Puedes añadir más enlaces como "Acerca de" en el futuro */}
          </nav>
        </div>
      </header>
    );
  }
  
  export default Header;