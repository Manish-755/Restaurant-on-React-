import { useNavigate } from "react-router-dom";

export default function Home() {
  // Fix: use useNavigate instead of window.location.href to avoid full page reload
  const navigate = useNavigate();

  // Dynamic Specials Data
  const specials = [
    {
      name: "Lamb Biryani",
      img: "https://images.pexels.com/photos/12737921/pexels-photo-12737921.jpeg",
    },
    {
      name: "Butter Chicken",
      img: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg",
    },
    {
      name: "Paneer Tikka",
      img: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    },
  ];

  return (
    <div>
      {/* HERO SECTION */}
      <div className="hero">
        <h1>Welcome to The Grand Eatery</h1>
        <p>A place where taste meets tradition</p>

        {/* CTA Button — Fix: useNavigate instead of window.location.href */}
        <button onClick={() => navigate("/menu")}>
          Explore Menu
        </button>
      </div>

      {/* ABOUT SECTION */}
      <section className="section">
        <h2>Our Story</h2>
        <p>
          Since 2010, The Grand Eatery has been serving delicious meals made
          with fresh ingredients and passion. We combine tradition with modern
          flavors to create unforgettable dining experiences.
        </p>
      </section>

      {/* SPECIALS */}
      <section className="section">
        <h2>Today's Specials</h2>

        <div className="grid">
          {specials.map((item, index) => (
            <div className="card" key={index}>
              <img src={item.img} alt={item.name} />
              <h3>{item.name}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}