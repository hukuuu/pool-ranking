import React, { useState } from 'react'
import { firestore, auth } from 'firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import Loader from '../components/Loading'
import { calculateRankings } from '../util/elo'
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Dialog,
  Button,
  Divider
} from '@material-ui/core'

import styled from 'styled-components'

const DialogContent = styled.div`
  height: 150px;
  display: flex;
  flex-direction: column;
  padding: 0 2rem;
  justify-content: space-evenly;
  align-items: stretch;
`

const DialogHeader = styled.div`
  display: flex;
  padding: 1rem 2rem;
  justify-content: center;
  align-items: center;
`

const RecordGame = () => {
  const [authUser, loadingUser] = useAuthState(auth())
  const [users, loadingUsers] = useCollectionData(
    firestore().collection('users')
  )

  const [oponent, setOponent] = useState(null)

  const doRecordGame = async won => {
    const winnerRef = firestore()
      .collection('users')
      .doc(won ? authUser.uid : oponent.uid)

    const looserRef = firestore()
      .collection('users')
      .doc(won ? oponent.uid : authUser.uid)

    const winner = (await winnerRef.get()).data()
    const looser = (await looserRef.get()).data()

    const [newWinnerRank, newLooserRank] = calculateRankings(
      winner.rank,
      looser.rank
    )

    winnerRef.update({
      rank: newWinnerRank,
      delta: newWinnerRank - winner.rank
    })

    looserRef.update({
      rank: newLooserRank,
      delta: newLooserRank - looser.rank
    })

    firestore()
      .collection('games')
      .add({
        winner: winner.displayName,
        looser: looser.displayName,
        date: Date.now()
      })

    setOponent(false)
  }

  if (loadingUser || loadingUsers) return <Loader />

  return (
    <div>
      <h1>Who did you play against?</h1>

      <List>
        {users
          .filter(u => u.uid !== authUser.uid)
          .map((user, i) => (
            <ListItem key={i} onClick={() => setOponent(user)}>
              <ListItemAvatar>
                <Avatar src={user.photoUrl} />
              </ListItemAvatar>
              <ListItemText primary={user.displayName} />
            </ListItem>
          ))}
      </List>
      {oponent && (
        <Dialog open={!!oponent} onClose={() => setOponent(null)}>
          <DialogHeader>
            <Avatar src={authUser.providerData[0].photoURL} />

            <strong style={{ margin: '0 2rem' }}>-</strong>
            <Avatar src={oponent.photoUrl} />
            <Divider />
          </DialogHeader>
          <DialogContent>
            <Button
              variant="contained"
              color="primary"
              onClick={() => doRecordGame(true)}
            >
              I WON
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => doRecordGame(false)}
            >
              I LOST
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default RecordGame
