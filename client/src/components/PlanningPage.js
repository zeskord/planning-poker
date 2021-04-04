import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  InputGroup,
  Form,
  Button,
  BDiv,
  Badge,
  BImg,
} from "bootstrap-4-react";
import { UserList } from "./UserList";
import { NavigationBar } from "./NavigationBar";
//import { PopoverHelp } from './PopoverHelp'

export const PlanningPage = (props) => {
  const intervalID = useRef(undefined);

  const [userState, setUserState] = useState({
    user: {}, // name, isSpectator
  });
  const [markState, setMarkState] = useState({
    mark: undefined,
  });
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

  return (
    <BDiv bg="light">
      <NavigationBar
        userName={userState.user.name}
        setAuthState={props.setAuthState}
      />
      <Container>
        <InputGroup lg my="2">
          <InputGroup.PrependText>Оценка</InputGroup.PrependText>
          <Form.Input type="number" onChange={markChange} onKeyUp={markKeyUp} />
        </InputGroup>
        <Button primary lg my="2" onClick={sendClick}>
          Отправить
        </Button>
        <UserList
          users={state.users}
          marksVisible={state.marksVisible}
          currentUserName={userState.user.name}
        />
        <BImg my="2" src={state.marksVisible ? "eye.svg" : "eye-slash.svg"} width="24" height="24" />
        <BDiv pt="2">
          <Button success lg onClick={openClick}>
            Вскрываемся
          </Button>
        </BDiv>
        <BDiv my="2">
          <Button warning lg my="2" onClick={clearMarksClick}>
            Очистить оценки
          </Button>
        </BDiv>
        <BDiv my="2">
          <Badge primary>0</Badge>
          <Badge secondary>0.5</Badge>
          <Badge success>1</Badge>
          <Badge danger>2</Badge>
          <Badge warning>3</Badge>
          <Badge info>5</Badge>
          <Badge primary>8</Badge>
          <Badge secondary>13</Badge>
          <Badge success>21</Badge>
          <Badge danger>34</Badge>
          <Badge warning>55</Badge>
          <Badge info>89</Badge>
          <Badge primary>144</Badge>
          <Badge secondary>233</Badge>
        </BDiv>
      </Container>
    </BDiv>
  );
};
