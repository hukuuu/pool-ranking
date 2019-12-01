import React from 'react'
import { auth, firestore } from 'firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useDocument } from 'react-firebase-hooks/firestore'
import { Link } from 'react-router-dom'
import Loading from '../components/Loading'

const exist = doc => doc && doc.exists

const Home = () => {
  const [user] = useAuthState(auth())
  const [userInfo, loading] = useDocument(firestore().doc(`users/${user.uid}`))

  const enroll = () => {
    firestore()
      .collection('users')
      .doc(user.uid)
      .set({
        rank: 1200,
        displayName: user.providerData[0].displayName,
        email: user.providerData[0].email,
        photoUrl: user.providerData[0].photoURL,
        uid: user.uid
      })
  }
  if (loading) return <Loading />
  return (
    <div>
      <h1>{user.displayName}</h1>

      {!exist(userInfo) && <button onClick={enroll}>enroll</button>}

      {exist(userInfo) && <h1>Rank: {userInfo.data().rank}</h1>}
    </div>
  )
}

export default Home
