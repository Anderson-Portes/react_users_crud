import { useState, useEffect } from "react";
import { Navbar, Container, Nav, Button, Modal, Form, Card, Col, Row } from "react-bootstrap";
import axios from "axios";

const API_URL = "https://users-api-nestjs.herokuapp.com/users"
const INITIAL_USER_STATE = {
  name: "",
  email: "",
  password: "",
  genre: "",
  description: "",
  photoUrl: ""
}

function App() {

  const [show, setShow] = useState(false)
  const [isUpdating, setIsUpdating] = useState({ _id: null })
  const [userData, setUserData] = useState(INITIAL_USER_STATE)
  const [users, setUsers] = useState(null)

  const handleSubmit = e => {
    e.preventDefault()
    if (isUpdating._id) {
      axios.patch(API_URL + "/" + isUpdating._id, userData)
        .then(response => {
          getAllUsers()
          setShow(false)
          setUserData(INITIAL_USER_STATE)
          setIsUpdating({ _id: null })
        })
    } else {
      axios.post(API_URL, userData)
        .then(() => {
          getAllUsers()
          setShow(false)
          setUserData(INITIAL_USER_STATE)
        })
    }
  }

  const updateUser = (item) => {
    setIsUpdating({ _id: item._id })
    setUserData(item)
    setShow(true)
  }

  const getAllUsers = () => {
    axios.get(API_URL)
      .then(response => setUsers(response.data))
  }

  const deleteUser = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(response => {
        getAllUsers()
      })
  }

  const closeModal = () => {
    setShow(false);
    setUserData(INITIAL_USER_STATE);
    setIsUpdating({ _id: null });
  }

  useEffect(getAllUsers, [])

  return (
    <div>
      <Navbar bg="dark" expand="lg" variant="dark">
        <Container>
          <Navbar.Brand>
            Users Management
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar" className="justify-content-end">
            <Nav>
              <Button onClick={() => setShow(true)} className="mt-3 mt-md-0">
                <i className="bi bi-plus-circle me-2"></i>
                Adicionar
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="py-4">
        <Modal show={show}>
          <Modal.Header closeButton onHide={closeModal}>
            <Modal.Title>{isUpdating._id ? 'Atualizar' : 'Adicionar'} Usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Control type="text" placeholder="Nome..." value={userData.name}
                onChange={e => setUserData({
                  ...userData, name: e.target.value
                })} className="mb-2" required />
              <Form.Control type="email" placeholder="Email..." value={userData.email}
                onChange={e => setUserData({ ...userData, email: e.target.value })} className="mb-2"
                required />
              <Form.Control type="password" placeholder="Senha...." value={userData.password}
                onChange={e => setUserData({ ...userData, password: e.target.value })} className="mb-2"
                required />
              <Form.Control as="textarea" placeholder="Descrição..."
                value={userData.description} onChange={e => setUserData({
                  ...userData, description: e.target.value
                })} className="mb-2" style={{ height: '100px' }} required />
              <Form.Control type="text" placeholder="Link da foto..."
                value={userData.photoUrl} onChange={e => setUserData({
                  ...userData, photoUrl: e.target.value
                })} className="mb-2" required />
              <Form.Check type="radio" name="genero" label="Feminino" inline required
                onChange={() => setUserData({ ...userData, genre: "Feminino" })} />
              <Form.Check type="radio" name="genero" label="Masculino" inline required
                onChange={() => setUserData({ ...userData, genre: "Masculino" })} />
              <Button type="submit" className="d-block mt-4 w-100">
                <i className="bi bi-check2-circle me-2"></i>
                Enviar
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
        <Row className="py-3">
          {users?.map(item => (
            <Col md={6} lg={4} key={item._id}>
              <Card className="mb-3 shadow">
                <Card.Img src={item.photoUrl} />
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                  <Card.Text className="text-primary">{item.email}</Card.Text>
                  <Card.Text className="text-success">{item.genre}</Card.Text>
                  <Button variant="danger" onClick={() => deleteUser(item._id)} className="w-100 mb-1">
                    <i className="bi bi-trash me-2"></i>
                    Excluir
                  </Button>
                  <Button variant="success" className="ms-2 w-100" onClick={() => updateUser(item)}>
                    <i className="bi bi-pencil me-2"></i>
                    Editar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <div className="bg-dark text-white py-3 text-center">
        <h4>&copy; Anderson Portes - 2022</h4>
      </div>
    </div>
  );
}

export default App;
