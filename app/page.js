'use client'
import Image from "next/image";
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { AppBar, Box, Button, IconButton, Modal, Stack, TextField, Toolbar, Typography, Paper } from '@mui/material'
import { collection, query, getDocs, getDoc, deleteDoc, setDoc, doc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const updateInventory = async() => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = getDoc(docRef)

    if((await docSnap).exists()){
      const { quantity } = (await docSnap).data()
      if(quantity === 1){
        await deleteDoc(docRef)
      }
      else{
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }

    await updateInventory()
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = getDoc(docRef)

    if((await docSnap).exists()){
      const { quantity } = (await docSnap).data()
      await setDoc(docRef, { quantity: quantity + 1 })
    }
    else{
      await setDoc(docRef, { quantity: 1 })
    }

    await updateInventory()
  }
  
  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      width="100vw"
      height="100vh"
      sx={{
        background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        padding: 4,
        color: 'white',
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none', marginBottom: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>
            StockPal
          </Typography>
        </Toolbar>
      </AppBar>

      <Box>
        <Typography variant="h3" fontWeight="bold">
          Welcome to StockPal!
        </Typography>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Paper
          elevation={12}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 400,
            transform: 'translate(-50%, -50%)',
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            backgroundColor: '#333',
            color: 'white'
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" spacing={2} direction="row">
            <Box bgcolor={'gray'} borderRadius={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              sx={{ input: { color: 'white' }, label: { color: 'white' } }}
              InputLabelProps={{ style: { color: 'white' } }}
            />
            </Box>
            <Button
              variant="contained"
              color="primary"
              sx={{ backgroundColor: '#1e88e5', ':hover': { backgroundColor: '#1565c0' } }}
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Paper>
      </Modal>
      <Button
        variant="contained"
        color="primary"
        sx={{ backgroundColor: '#1e88e5', ':hover': { backgroundColor: '#1565c0' } }}
        onClick={handleOpen}
      >
        Add Item
      </Button>
      <Paper
        elevation={6}
        sx={{
          width: '80%',
          height: '60%',
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#444',
          color: 'white'
        }}
      >
        <Box
          width="100%"
          padding={2}
          bgcolor="#111"
          display="flex"
          alignItems="center"
          justifyContent="center"
          marginBottom={2}
          borderRadius={1}
        >
          <Typography variant="h4" color="white">
            Inventory Items
          </Typography>
        </Box>
        <Stack width="100%" spacing={2} sx={{ maxHeight: '400px', overflow: 'auto' }}>
          {inventory.map(({ name, quantity }) => (
            <Paper
              key={name}
              elevation={3}
              sx={{
                width: '100%',
                minHeight: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 2,
                backgroundColor: '#222',
                color: 'white',
                borderRadius: 1
              }}
            >
              <Typography variant="h5">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <IconButton onClick={() => addItem(name)}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ backgroundColor: '#1e88e5', ':hover': { backgroundColor: '#1565c0' } }}
                  >
                    +
                  </Button>
                </IconButton>
                <Typography variant="h6">
                  {quantity}
                </Typography>
                <IconButton onClick={() => removeItem(name)}>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ backgroundColor: '#e53935', ':hover': { backgroundColor: '#d32f2f' } }}
                  >
                    -
                  </Button>
                </IconButton>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Paper>
    </Box>
  )
}
