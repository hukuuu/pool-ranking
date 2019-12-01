import React from 'react'
import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import config from './firebaseConfig'
import { useAuthState } from 'react-firebase-hooks/auth'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import Loading from './components/Loading'
import Login from './Authentication/Login'
import Home from './Dashboard/Home'
import Leaderboard from './Dashboard/Leaderboard'
import RecordGame from './Dashboard/RecordGame'

const firebaseApp = app.initializeApp(config)
window.store = firebaseApp.firestore()

function App() {
  const [user, loading] = useAuthState(firebaseApp.auth())

  if (loading) return <Loading />
  return (
    <Router>
      {!user && <Redirect to={'/login'} />}
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/" exact component={Home} />
        <Route exact path="/leaderboard" component={Leaderboard} />
        <Route exact path="/record" component={RecordGame} />
      </Switch>
    </Router>
  )
}

export default App
