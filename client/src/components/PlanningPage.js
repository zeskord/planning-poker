import React, { useState, useEffect, useRef } from "react";
import { UserList } from "./UserList";
import { SpectatorList } from "./SpectatorList";
import { NavigationBar } from "./NavigationBar";
import { PokerCards } from "./PokerCards";
import {Modal} from "bootstrap"

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
      const url = "/api/getUserData";
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
      const url = "/api/tick";
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
      const url = "/api/sendMark";
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
      const url = "/api/showMarks";
      await fetch(url, { method: "POST" });
      tick();
    } catch (error) {
      console.error("Ошибка:", error);
    }
  }

  async function clearMarksClick(event) {
    try {
      const url = "/api/clearMarks";
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
      <div className="container-sm">
        <div className="input-group input-group-lg my-2">
          <span className="input-group-text">Оценка</span>
          <input
            type="number"
            className="form-control"
            onChange={markChange}
            onKeyUp={markKeyUp}
            value={markClient || ""}
          ></input>
          <button
            className="btn btn-secondary"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#myModal"
            // id="button-addon2"
            onClick={markSelect}
          >
            . . .
          </button>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-lg my-2"
          onClick={changeMark}
        >
          Отправить
        </button>
        <UserList
          users={state.users}
          marksVisible={marksVisible}
          currentUserName={userState.user.name}
        />
        <img
          className="my-2"
          src={marksVisible ? "eye.svg" : "eye-slash.svg"}
          // width="24"
          // height="24"
        />
        <div className="pt-2">
          <button
            type="button"
            className="btn btn-success btn-lg"
            onClick={openClick}
          >
            Вскрываемся
          </button>
        </div>
        <div className="my-2">
          <button
            type="button"
            className="btn btn-warning btn-lg my-2"
            onClick={clearMarksClick}
          >
            Очистить оценки
          </button>
        </div>
        {spectators.list.length !== 0 && (
          <div className="card my-4">
            <div className="card-header">Зрители</div>
            <div className="card-body">
              <SpectatorList
                className="my-2 px-2"
                spectators={spectators.list}
              />
            </div>
          </div>
        )}
      </div>
      <div
        className={"modal fade"}
        id="myModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-hidden={!show}
        // aria-hidden="false"
        // onHide={handleClose}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Выбор оценки</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Закрыть"
              ></button>
            </div>
            <div className="modal-body">
              <PokerCards modalOnSelect={modalOnSelect}/>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-lg my-2"
                data-bs-dismiss="modal"
                onClick={handleClose}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
