import './index.css'

const Items = props => {
  const {details, deleteBtn, editBtn} = props
  const {name, username, id, email} = details

  const DeleteUser = () => {
    deleteBtn(id)
  }

  const editUser = () => {
    editBtn(id)
  }

  return (
    <li className="listItems">
      <h1>{name}</h1>
      <p className="para">{username}</p>
      <p>{email}</p>
      <div className="btn">
        <button type="button" onClick={editUser} className="btn1">
          Edit
        </button>
        <button type="button" onClick={DeleteUser} className="btn2">
          Delete
        </button>
      </div>
    </li>
  )
}
export default Items
