class RoleServices{
    static isAdmin(){
        const role = localStorage.getItem("Restaurentrole")
        return role === "Admin";
    }

    static isChef(){
        const role = localStorage.getItem("Restaurentrole")
        return role === "Chef";
    }

    static isWaiter(){
        const role = localStorage.getItem("Restaurentrole")
        return role === "Waiter";
    }

    static isEmployee(){
        const role = localStorage.getItem("Restaurentrole")
        return role === "Admin" ||role === "Chef" || role === "Waiter";
    }
}

export default RoleServices;