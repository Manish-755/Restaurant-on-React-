import { useState, useEffect } from "react";

export default function Team() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgErrors, setImgErrors] = useState({});

  useEffect(() => {
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => { setTeamMembers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleImgError = (id) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  if (loading) return <div className="page"><p>Loading team...</p></div>;

  return (
    <div className="page">
      <h1>Our Team</h1>

      <div className="grid">
        {teamMembers.map((member) => (
          <div className="card" key={member._id}>
            {imgErrors[member._id] || !member.img ? (
              <div className="img-fallback">👤</div>
            ) : (
              <img
                src={member.img}
                alt={member.name}
                onError={() => handleImgError(member._id)}
              />
            )}
            <h3>{member.name}</h3>
            <p className="card-meta">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}