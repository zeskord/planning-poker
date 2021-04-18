import React, { useState, useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Image from "react-bootstrap/Image";
import FormControl from "react-bootstrap/FormControl";
import { UserList } from "./UserList";
import { NavigationBar } from "./NavigationBar";
import { PokerCard } from "./PokerCard";
// import Modal from "react-bootstrap/Modal";
import Modal from "react-bootstrap/Modal";
import CardDeck from "react-bootstrap/CardDeck";

export const PlanningPage = (props) => {
  const intervalID = useRef(undefined);

  const [userState, setUserState] = useState({
    user: {}, // name, isSpectator
  });

  const [markState, setMarkState] = useState({
    mark: undefined,
  });

  const [show, setShow] = useState(false);

  const [state, setState] = useState({
    users: [], // Пользователи со всеми данными.
    spectators: [], // Зрители со всеми данными.
    userIDs: [], // Просто массив идентификаторов пользователей
    spectatorIDs: [], // Просто массив идентификаторов зрителей
    marksVisible: false, // Оценки вскрыты?
  });

  useEffect(() => {
    // Запрашиваем с сервера, как он видит текущего пользователя.
    // Устанавливаем обработчик ожидания tick.
    getUserData();
    return () => {
      clearInterval(intervalID.current);
    };
  }, [props]);

  async function getUserData() {
    try {
      const url = "/getUserData";
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const json = await response.json();
      const user = {
        name: json.user,
        isSpectator: json.isSpectator,
      };
      setUserState((prev) => {
        return {
          ...prev,
          user: user,
        };
      });
      await tick();
      intervalID.current = setInterval(tick, 2000);
    } catch (error) {
      console.error("Ошибка:", error);
    }
  }

  // Глобальный клиентский тик.
  async function tick() {
    try {
      const url = "/tick";
      const response = await fetch(url);
      const responseData = await response.json();
      setState((prev) => {
        return {
          ...prev,
          users: responseData.users,
          spectators: responseData.spectators,
          marksVisible: responseData.marksVisible,
        };
      });
    } catch (error) {
      console.error("Ошибка:", error);
    }
  }

  function markChange(event) {
    var mark_temp = event.target.value;

    setMarkState((prev) => {
      return {
        ...prev,
        mark: mark_temp,
      };
    });
  }

  async function sendClick(event) {
    try {
      const url = "/sendMark";
      const reqBody = {
        user: userState.user.name,
        mark: markState.mark,
      };
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(reqBody),
      });
      await response.text();
      tick();
    } catch (error) {
      console.error("Ошибка:", error);
    }
  }

  async function markKeyUp(event) {
    if (event.keyCode === 13) {
      sendClick(event);
    }
  }

  async function openClick(event) {
    try {
      const url = "/showMarks";
      await fetch(url, { method: "POST" });
      tick();
    } catch (error) {
      console.error("Ошибка:", error);
    }
  }

  async function clearMarksClick(event) {
    try {
      const url = "/clearMarks";
      await fetch(url, { method: "POST" });
      tick();
    } catch (error) {
      console.error("Ошибка:", error);
    }
  }

  async function markSelect(event) {
    try {
      setShow(true);
    } catch (error) {
      console.error("Ошибка:", error);
    }
  }

  async function modalOnHide() {
    console.log("modalOnHide")
    setShow(false)
  }
  
  async function modalOnSelect(selectedValue) {
    console.log(selectedValue)
    setShow(false)
    setMarkState((prev) => {
      return {
        ...prev,
        mark: selectedValue,
      };
    });
    await sendClick(undefined)
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div bg="light">
      <NavigationBar
        userName={userState.user.name}
        setAuthState={props.setAuthState}
      />
      <Container>
        <InputGroup className="my-2" size="lg">
          <InputGroup.Prepend>
            <InputGroup.Text>Оценка</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            type="number"
            onChange={markChange}
            onKeyUp={markKeyUp}
            value={markState.mark}
          />
          <InputGroup.Append>
            <Button
              id="basic-addon2"
              variant="secondary"
              onClick={markSelect}
            >
              . . .
            </Button>
          </InputGroup.Append>
        </InputGroup>
        <Button
          variant="primary"
          size="lg"
          className="my-2"
          onClick={sendClick}
        >
          Отправить
        </Button>
        <UserList
          users={state.users}
          marksVisible={state.marksVisible}
          currentUserName={userState.user.name}
        />
        <Image
          className="my-2"
          src={state.marksVisible ? "eye.svg" : "eye-slash.svg"}
          // width="24"
          // height="24"
        />
        <div className="pt-2">
          <Button variant="success" size="lg" onClick={openClick}>
            Вскрываемся
          </Button>
        </div>
        <div className="my-2">
          <Button
            variant="warning"
            size="lg"
            className="my-2"
            onClick={clearMarksClick}
          >
            Очистить оценки
          </Button>
        </div>
        <div className="my-2">
          <Badge variant="primary">0</Badge>
          <Badge variant="secondary">0.5</Badge>
          <Badge variant="success">1</Badge>
          <Badge variant="danger">2</Badge>
          <Badge variant="warning">3</Badge>
          <Badge variant="info">5</Badge>
          <Badge variant="primary">8</Badge>
          <Badge variant="secondary">13</Badge>
          <Badge variant="success">21</Badge>
          <Badge variant="danger">34</Badge>
          <Badge variant="warning">55</Badge>
          <Badge variant="info">89</Badge>
          <Badge variant="primary">144</Badge>
          <Badge variant="secondary">233</Badge>
        </div>
      </Container>
      
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Выбор оценки</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CardDeck>
            <PokerCard variant="primary" key="1" title = "0" onClick={modalOnSelect}/>
            <PokerCard variant="primary" key="2" title = "0.5" onClick={modalOnSelect}/>
            <PokerCard variant="primary" key="3" title = "1"  onClick={modalOnSelect}/>
          </CardDeck>
          {/* <CardDeck>
            <PokerCard variant="primary" key="4" title = "2"/>
            <PokerCard variant="primary" key="5" title = "3"/>
            <PokerCard variant="primary" key="6" title = "5"/>
          </CardDeck>
          <CardDeck>
            <PokerCard variant="primary" key="7" title = "8"/>
            <PokerCard variant="primary" key="8" title = "13"/>
            <PokerCard variant="primary" key="9" title = "21"/>
          </CardDeck>
          <CardDeck>
            <PokerCard variant="primary" key="10" title = "34"/>
            <PokerCard variant="primary" key="11" title = "55"/>
            <PokerCard variant="primary" key="12" title = "89"/>
          </CardDeck> */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Закрыть
          </Button>
          <Button variant="primary">Выбрать</Button>
        </Modal.Footer>
      </Modal>


    </div>
  );
};
