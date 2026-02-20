let users = JSON.parse(localStorage.getItem("users")) || [];
export class User {
    constructor(name, Role, Email, password, Active = true) {
        if (users.length > 0) {
            for (let user of users) {
                if (user.Email === Email) {
                    return;
                }
            }
            this.id = User.generateId(Role);
            this.name = name;
            this.dateCreated = new Date().toString();
            if (Role === "Admin") {
                this.Role = "Admin";
            }
            else if (Role === "User") {
                this.Role = "User";
            }
            else if (Role === "Seller") {
                this.Role = "Seller";
                this.rating = 0;
                this.location = "";
                this.totalProducts = 0;
                this.description = "";
            }
            this.Email = Email;
            this.password = password;
            this.Active = Active;
        }
        else {
            this.id = User.generateId(Role);
            this.name = name;
            this.dateCreated = new Date().toString();
            if (Role === "Admin") {
                this.Role = "Admin";
            }
            else if (Role === "User") {
                this.Role = "User";
            }
            else if (Role === "Seller") {

                this.Role = "Seller";
                this.rating = 0;
                this.location = "";
                this.totalProducts = 0;
                this.description = "";

            }
            this.Email = Email;
            this.password = password;
            this.Active = Active;
        }
    }
    static generateId(Role) {

        if (users.length === 0) {
            if (Role === "Admin") {
                return `Admin${1}`;
            }
            else if (Role === "User") {
                return `Us${1}`;
            }
            else if (Role === "Seller") {
                return `SLR${1}`;
            }
        } else {
            if (Role === "Admin") {
                return `Admin${users.filter(u => u.Role === "Admin").length + 1}`;
            }
            else if (Role === "User") {
                return `Us${users.filter(u => u.Role === "User").length + 1}`;
            }
            else if (Role === "Seller") {
                return `SLR${users.filter(u => u.Role === "Seller").length + 1}`;
            }
        }
    }

}

