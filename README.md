Race your friends to the 2048 tile!

---

![](img/demo.png)

![](img/demo_win.png)

---
### Deployment
* The front-end React app is hosted via Vercel [here](https://2048-racer.vercel.app/)!
* Backend (and online racing functionalities) will be deployed soon.
### Usage
If you wish to run locally (and race yourself on multiple windows!)
1. Fork the repo
2. Open a terminal window, then navigate to 2048Racer/backend
    * run `go run main.go`
**OR**
    * run `docker build -t backend .` and `docker run -it -p 8080:8080 backend`
3. Open another terminal window, then navigate to 2048Racer/frontend.
    * run `npm start`

Start racing!
