import {Component} from 'react'
import {v4 as uuidv4} from 'uuid'
import Modal from 'react-modal'
import Items from '../Items'
import './index.css'

class Home extends Component {
  state = {
    list: [],
    error: '',
    showError: false,
    modelOpen: false,
    name: '',
    username: '',
    email: '',
    userid: null,
    editing: false,
  }

  componentDidMount() {
    this.getUserDetails()
  }

  onChangeName = e => {
    this.setState({name: e.target.value})
  }

  onChangeUserName = e => {
    this.setState({username: e.target.value})
  }

  onChangeEmail = e => {
    this.setState({email: e.target.value})
  }

  deleteBtn = async id => {
    const url = `https://jsonplaceholder.typicode.com/users/${id}` // Fix the URL
    const options = {
      method: 'DELETE',
    }

    try {
      const response = await fetch(url, options)

      if (response.ok === true) {
        this.setState(prevState => ({
          list: prevState.list.filter(user => user.id !== id),
        }))
      } else {
        throw new Error('Failed to delete user')
      }
    } catch (error) {
      this.setState({error: error.message, showError: true})
    }
  }

  editBtn = id => {
    const {list} = this.state
    const userToEdit = list.find(each => each.id === id)
    if (userToEdit) {
      this.setState({
        name: userToEdit.name,
        username: userToEdit.username,
        email: userToEdit.email,
        userid: userToEdit.id,
        modelOpen: true,
        editing: true,
      })
    }
  }

  getUserDetails = async () => {
    const url = 'https://jsonplaceholder.typicode.com/users'
    const response = await fetch(url)
    if (response.ok === true) {
      const data = await response.json()
      try {
        this.setState({list: data})
      } catch (error) {
        this.setState({error: 'Failed to fetch users', showError: true})
      }
    }
  }

  onSubmitForm = async e => {
    e.preventDefault()
    const {name, username, email, editing, userid, list} = this.state

    const userDetails = {
      id: uuidv4(),
      name,
      username,
      email,
    }
    if (editing) {
      const url = `https://jsonplaceholder.typicode.com/users/${userid}`

      const options = {
        method: 'PUT',
        body: JSON.stringify(userDetails),
        headers: {
          'Content-Type': 'application/json',
        },
      }

      try {
        const response = await fetch(url, options)
        if (response.ok) {
          const updatedUser = await response.json()
          const updatedList = list.map(user =>
            user.id === updatedUser.id ? updatedUser : user,
          )
          this.setState({
            list: updatedList,
            name: '',
            username: '',
            email: '',
            userid: null,
            editing: false,
            modelOpen: false,
          })
        } else {
          throw new Error('Failed to update user')
        }
      } catch (error) {
        this.setState({error: error.message, showError: true})
      }
    } else {
      const url = 'https://jsonplaceholder.typicode.com/users'
      const options = {
        method: 'POST',
        body: JSON.stringify(userDetails),
        headers: {
          'Content-Type': 'application/json',
        },
      }

      try {
        const response = await fetch(url, options)
        if (response.ok) {
          const data = await response.json()

          this.setState(prevState => ({
            list: [...prevState.list, {...data, id: userDetails.id}],
            name: '',
            username: '',
            email: '',
            modelOpen: false,
          }))
        } else {
          throw new Error('Failed to post user')
        }
      } catch (error) {
        this.setState({error: error.message, showError: true})
      }
    }
  }

  openModel = () => {
    this.setState({modelOpen: true})
  }

  closeModel = () => {
    this.setState({modelClose: true, modelOpen: false})
  }

  render() {
    const {
      list,
      error,
      showError,
      modelOpen,
      name,
      username,
      email,
      editing,
    } = this.state
    return (
      <div className="container">
        <div className="add">
          <button onClick={this.openModel} type="button" className="adduser">
            Add User
          </button>
        </div>
        {modelOpen && (
          <Modal isOpen={modelOpen} onClose={this.closeModel}>
            <form onSubmit={this.onSubmitForm} className="form">
              <div className="input">
                <span>Name: </span>
                <input type="text" value={name} onChange={this.onChangeName} />
              </div>
              <div className="input">
                <span>Username: </span>
                <input
                  type="text"
                  value={username}
                  onChange={this.onChangeUserName}
                />
              </div>
              <div className="input">
                <span>Email: </span>
                <input
                  type="text"
                  value={email}
                  onChange={this.onChangeEmail}
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={this.closeModel}
                  className="modalbtn"
                >
                  Close Modal
                </button>

                {editing ? (
                  <button type="submit" className="modalbtn">
                    Save
                  </button>
                ) : (
                  <button type="submit" className="modalbtn">
                    Add User
                  </button>
                )}
              </div>
            </form>
          </Modal>
        )}

        {showError && <p>{error}</p>}

        <ul>
          {list.map(each => (
            <Items
              details={each}
              key={each.id}
              deleteBtn={this.deleteBtn}
              editBtn={this.editBtn}
            />
          ))}
        </ul>
      </div>
    )
  }
}
export default Home
//
