let users = JSON.parse(localStorage.getItem("users")) || [];
export class User {
    constructor(Fname, Lname, Role, Email, password, street, city, country, Phone, Active = true) {
        if (users.length > 0) {
            for (let user of users) {
                if (user.Email === Email) {
                    return;
                }
            }
            this.id = User.generateId(Role);
            this.Fname = Fname;
            this.Lname = Lname;
            this.dateCreated = new Date().toString();

            this.address = `${street}, ${city}, ${country}`;
            this.Phone = Phone;
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
            this.Fname = Fname;
            this.Lname = Lname;
            this.Phone = Phone;
            this.address = `${street}, ${city}, ${country}`;
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
                this.totalProducts = 0;
            }
            this.Email = Email;
            this.password = password;
            this.Active = Active;
        }
    }
    static generateId(Role) {

        if (users.length === 0) {
            if (Role === "Admin") {
                return `Admin-${1}`;
            }
            else if (Role === "User") {
                return `Us-${1}`;
            }
            else if (Role === "Seller") {
                return `SLR-${1}`;
            }
        } else {
            if (Role === "Admin") {
                users = users.map
                    (u => u.Role === "Admin" ? parseInt(u.id.split("-")[1]) : 0);
                return `Admin-${Math.max(...users) + 1}`;
                //
            }
            else if (Role === "User") {
                users = users.map
                    (u => u.Role === "User" ? parseInt(u.id.split("-")[1]) : 0);
                return `Us-${Math.max(...users) + 1}`;
            }
            else if (Role === "Seller") {
                users = users.map
                    (u => u.Role === "Seller" ? parseInt(u.id.split("-")[1]) : 0);
                return `SLR-${Math.max(...users) + 1}`;
            }
        }
    }

}

