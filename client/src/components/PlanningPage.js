import React, { useState, useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import FormControl from "react-bootstrap/FormControl";
import { UserList } from "./UserList";
import { SpectatorList } from "./SpectatorList";
import { NavigationBar } from "./NavigationBar";
import { PokerCard } from "./PokerCard";
import Modal from "react-bootstrap/Modal";
import CardDeck from "react-bootstrap/CardDeck";
import Card from "react-bootstrap/Card";

export const PlanningPage = (props) => {
  const intervalID = useRef(undefined);

  // Стейт текущего пользователя.
  const [userState, setUserState] = useState({
    user: {}, // name, isSpectator
  });

  // Оценка, которая была отправлена на сервер. При изменении обязательно должна
  // отправиться на сервер.
  const [mark, setMark] = useState(undefined);

  // Оценка, которая изменяется в поле ввода, но не обязательно отправлялась на сервер.
  const [markClient, setMarkClient] = useState(undefined);

  // Показывается ли в текущий момент модальное окно выбора оценки.
  const [show, setShow] = useState(false);

  const [marksVisible, setMarksVisible] = useState(false);

  const [state, setState] = useState({
    users: [], // Пользователи со всеми данными.
    spectators: [], // Зрители со всеми данными.
    userIDs: [], // Просто массив идентификаторов пользователей
    spectatorIDs: [], // Просто массив идентификаторов зрителей
    marksVisible: false, // Оценки вскрыты?
  });

  const [spectators, setSpectators] = useState({ list: [] });

  useEffect(() => {
    // Запрашиваем с сервера, как он видит текущего пользователя.
    // Устанавливаем обработчик ожидания tick.
    getUserData();
    return () => {
      clearInterval(intervalID.current);
    };
  }, [props]);

  useEffect(() => {
    // undefined - это когда происходит очистка оценок.
    if (mark !== undefined) {
      sendMark();
    }
  }, [mark]);

  useEffect(() => {
    // console.log("useEffect markClient")
  }, [markClient]);

  // Возникает, когда на сервере меняется таблица пользователей.
  useEffect(() => {
    // console.log("useEffect state ", state)

    var myUserDataOnServer = state.users.find(
      (us) => us.name === userState.user.name
    );
    if (
      myUserDataOnServer !== undefined &&
      myUserDataOnServer.mark === undefined &&
      mark !== undefined
    ) {
      setMark(undefined);
    }

    // if (marksVisible === false) {
    //   setMark(undefined)
    // }
  }, [state]);

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
        };
      });
      setSpectators((prev) => {
        return {
          ...prev,
          list: responseData.spectators,
        };
      });
      setMarksVisible(responseData.marksVisible);
    } catch (error) {
      console.error("Ошибка:", error);
    }
  }

  function markChange(event) {
    var mark_temp = event.target.value;
    setMarkClient(mark_temp);
  }

  async function sendMark() {
    try {
      // console.log("sendMark()")
      const url = "/sendMark";
      const reqBody = {
        user: userState.user.name,
        mark: markClient, // на сервер отправляем клиентскую оценку.
      };
      // console.log(reqBody)
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(reqBody),
      });
      await response.text();
      await tick();
    } catch (error) {
      console.error("Ошибка:", error);
    }
  }

  async function markKeyUp(event) {
    if (event.keyCode === 13) {
      sendMark();
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

  async function modalOnSelect(selectedValue) {
    setShow(false);

    var mark_temp = selectedValue;
    setMarkClient(mark_temp);
    setMark(mark_temp); // Сразу будет отправлено.
  }

  async function changeMark() {
    await setMark(markClient);
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
            value={markClient || ""}
          />
          <InputGroup.Append>
            <Button id="basic-addon2" variant="secondary" onClick={markSelect}>
              . . .
            </Button>
          </InputGroup.Append>
        </InputGroup>
        <Button
          variant="primary"
          size="lg"
          className="my-2"
          onClick={changeMark}
        >
          Отправить
        </Button>
        <UserList
          users={state.users}
          marksVisible={marksVisible}
          currentUserName={userState.user.name}
        />
        <Image
          className="my-2"
          src={marksVisible ? "eye.svg" : "eye-slash.svg"}
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
        {spectators.list.length !== 0 && (
          <Card className="my-4">
            <Card.Header>Зрители</Card.Header>
            <Card.Body>
              <SpectatorList
                className="my-2 px-2"
                spectators={spectators.list}
              />
            </Card.Body>
          </Card>
        )}
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
            <PokerCard
              variant="primary"
              key="1"
              title="0"
              onClick={modalOnSelect}
            />
            <PokerCard
              variant="primary"
              key="2"
              title="0.5"
              onClick={modalOnSelect}
            />
            <PokerCard
              variant="primary"
              key="3"
              title="1"
              onClick={modalOnSelect}
            />
          </CardDeck>
          <CardDeck>
            <PokerCard
              variant="primary"
              key="4"
              title="2"
              onClick={modalOnSelect}
            />
            <PokerCard
              variant="primary"
              key="5"
              title="3"
              onClick={modalOnSelect}
            />
            <PokerCard
              variant="primary"
              key="6"
              title="5"
              onClick={modalOnSelect}
            />
          </CardDeck>
          <CardDeck>
            <PokerCard
              variant="primary"
              key="7"
              title="8"
              onClick={modalOnSelect}
            />
            <PokerCard
              variant="primary"
              key="8"
              title="13"
              onClick={modalOnSelect}
            />
            <PokerCard
              variant="primary"
              key="9"
              title="21"
              onClick={modalOnSelect}
            />
          </CardDeck>
          <CardDeck>
            <PokerCard
              variant="primary"
              key="10"
              title="34"
              onClick={modalOnSelect}
            />
            <PokerCard
              variant="primary"
              key="11"
              title="55"
              onClick={modalOnSelect}
            />
            <PokerCard
              variant="primary"
              key="12"
              title="89"
              onClick={modalOnSelect}
            />
          </CardDeck>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Закрыть
          </Button>
          {/* <Button variant="primary">Выбрать</Button> */}
        </Modal.Footer>
      </Modal>
    </div>
  );
};
