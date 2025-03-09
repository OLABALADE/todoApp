import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <h1>TodoApp</h1>
      <nav>
        <Link to="signup">Signup</Link>
        <Link to="login">Login</Link>
      </nav>
    </div>
  )
}
