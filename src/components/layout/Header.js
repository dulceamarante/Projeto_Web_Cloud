
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('mulher');
  const [searchOpen, setSearchOpen] = useState(false);
  const [favOpen, setFavOpen] = useState(false);
  const { favorites } = useContext(FavoritesContext);

  useEffect(() => {
    const handleKey = e => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setFavOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

            FAVORITOS ({favorites.length})
          </a>
          <Link to="/cart">CESTA (0)</Link>
        </div>
      </header>

    </>
  );
};

export default Header;