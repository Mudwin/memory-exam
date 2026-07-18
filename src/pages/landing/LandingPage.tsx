import { Link } from "react-router";

const LandingPage = () => {
  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <h1>Memory Exam</h1>
      <Link to="/login">Войти</Link>
    </div>
  );
};

export default LandingPage;
