import React from "react";
import axios from "axios";

class LoginAPI {

    url = "/login";

    login(username, password) {
        return axios.post(this.url, {
            username,
            password
        });
    }
}

export class LoginFormComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: null,
            password: null,
            isFailed: false,
            isLoggedIn: false
        };

        this.api = new LoginAPI();

        this.login = this.login.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.successCallback = this.successCallback.bind(this);
        this.failureCallback = this.failureCallback.bind(this);
    }

    login(event) {
        event.preventDefault();

        this.api.login(this.state.username, this.state.password)
            .then(this.successCallback)
            .catch(this.failureCallback);
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: target.value
        });
    }

    successCallback(response) {
        const token = response.data.token;
        const user = response.data.user;

        console.log(token, user);

        sessionStorage.setItem('jwt', token);

        this.setState({
            isFailed: false,
            isLoggedIn: true,
            user: user
        });
    }

    failureCallback(response) {
        console.log(`failed to login: ${response}`);
        this.setState({
            isFailed: true,
            isLoggedIn: false
        });
    }

    render() {
        return <div>
            <form onSubmit={this.login}>
                <div>
                    <input type="text" name="username" onChange={this.handleInputChange}/>
                </div>
                <div>
                    <input type="password" name="password" onChange={this.handleInputChange}/>
                </div>
                <div>
                    <input type="submit" value="Login"/>
                </div>
            </form>
            {!!this.state.isFailed ?
                  <div>Failed to login!</div>
                : null }
            {!!this.state.isLoggedIn ?
                  <div>User {this.state.user.name} is successfully logged in!</div>
                : null }
        </div>
    }
}