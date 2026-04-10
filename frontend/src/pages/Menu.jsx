import { useState, useEffect } from "react";

export default function Menu() {
  const categories = ["All", "Appetizers", "Main Course", "Desserts", "Drinks"];

  const [menuData, setMenuData] = useState([]);
  const [category, setCategory] = useState("All");
  const [imgErrors, setImgErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => {
        setMenuData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredMenu =
    category === "All"
      ? menuData
      : menuData.filter((item) => item.category === category);

  const handleImgError = (id) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  if (loading) return <div className="page"><p>Loading menu...</p></div>;

  return (
    <div className="page">
      <h1>Our Menu</h1>

      <div className="menu-filters">
        {categories.map((btn) => (
          <button
            key={btn}
            className={`menu-filter-btn ${category === btn ? "menu-filter-active" : ""}`}
            onClick={() => setCategory(btn)}
          >
            {btn === "Main Course" ? "Main" : btn}
          </button>
        ))}
      </div>

      {filteredMenu.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <div className="grid">
          {filteredMenu.map((item) => (
            <div className="card menu-card" key={item._id}>
              <div className="menu-img-wrap">
                {imgErrors[item._id] ? (
                  <div className="menu-img-fallback">🍽️</div>
                ) : (
                  <img
                    src={item.img}
                    alt={item.name}
                    className="menu-item-img"
                    onError={() => handleImgError(item._id)}
                  />
                )}
                <span className={`menu-badge ${item.veg ? "menu-badge-veg" : "menu-badge-nonveg"}`}>
                  {item.veg ? "VEG" : "NON-VEG"}
                </span>
              </div>
              <div className="menu-card-body">
                <h3 className="menu-item-name">{item.name}</h3>
                <div className="menu-card-footer">
                  <p className="menu-item-price">₹{item.price}</p>
                  <p className="menu-item-category">{item.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}