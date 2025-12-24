<div align="center">
  <h1> Childcare Management System (server side) </h1>
</div>

# 🌟 Features
* Authentication & Authorization (JWT).
* Role-based Access Control.
* User Management (Admins, Teachers, Guardians…).
* Children Management (Add, approve, deactivate, status logic).
* Attendance System (Daily & Monthly).
* Subscriptions System (Add, renew, calculate end date…).
* Events & Activities Management.
* Payments & Expenses.
* Secure API Responses + Error Handling.

# 🛠️ Tech Stack
| Layer          | Technology                                   |
| ---------------| ---------------------------------------------|
| Runtime        | Node.js                                      |
| Framework      | Express.js                                   |
| Database       | MongoDB + Mongoose                           |
| Authentication | JWT                                          |
| Validation     | Mongoose Validation + Custom Logic           |
| Deployment     | Render - https://childcare-4muz.onrender.com |


# Project Structure
```bash
server/
|-- DB/
|   |-- db.js
|   `-- models/
|       |-- userSchema.js
|       |-- childrenSchema.js
|       |-- branchSchema.js
|       |-- attendanceSchema.js
|       |-- subscriptionSchema.js
|       |-- EventSchema.js
|       |-- classroomSchema.js
|       |-- ExpenseSchema.js
|       `-- paymentSchema.js
|
|-- routers/
|   `-- routes/
|   |-- user.js
|   |-- auth.js
|   |-- children.js
|   |-- branch.js
|   |-- attendance.js
|   |-- classroom.js
|   |-- dashboardState.js
|   |-- subscription.js
|   |-- event.js
|   `-- money.js
|
|   `-- controllers/
|   `-- middleware/
|   `-- uploads/
|
|-- scripts/
|   |-- seedAdmin.js
|   |-- subscriptionMonitor.js
|   |-- testEmail.js
|   |-- upload.js
|
|-- swagger/
|
|-- index.js
|-- .env
`-- README.md
```

# Installation & Setup
1 - Clone the repository
```bash
git clone https://github.com/RaghadAlquni/childcare.git
cd server
```
2 - Install dependencies
```bash
npm install
```
3 - Create .env
```bash
PORT=your_port
MONGO_DB=your_mongo_connection_string
SEED_ADMIN_IDNUMBER=your_admin_id
SEED_ADMIN_NAME=your_admin_name
SEED_ADMIN_EMAIL=your_admin_email
SEED_ADMIN_PASSWORD=your_password
SALT_ROUNDS=10
JWT_SECRET=your_secret_key

SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_email
SMTP_PASS=your_email_password
SMTP_FROM=your_sender_name

WHATSAPP_TOKEN=your_whatsapp_token
WHATSAPP_PHONE_ID=your_phone_id
```
4 - Run the server
```bash
npm start
```

# 📚 API Documentation (Swagger)
The full API documentation is available through Swagger UI:

**https://childcare-4muz.onrender.com/api-docs/**

# Endpoints (Summary)

* **Auth Route**

| HTTP METHOD      | Paths                | Permissions                     | Behavior                                                     |
| ---------------- | -------------------- | --------------------------------| ------------------------------------------------------------ |
| POST             | `/login`             | `Authentication & Authorization`| Login to the Dashboard                                       |

* **User Route**

| HTTP METHOD      | Paths                  | Permissions                     | Behavior                                                     |
| ---------------- | -----------------------| --------------------------------| ------------------------------------------------------------ |
| POST             | `/addUser`             | `Authentication & Authorization`| Add new Employee to the systm                                |
| GET              | `/directors`           | `Authentication & Authorization`| get all the Directors                                        |
| GET              | `/assistantDirectors`  | `Authentication & Authorization`| get all the Assistant Directors                              |
| GET              | `/managedTeachers`     | `Authentication & Authorization`| get all the teachers under this Director                     |
| GET              | `/teachers/all`        | `Authentication & Authorization`| get all teachers for admin                                   |

* **Children Route**

| HTTP METHOD      | Paths                | Permissions                     | Behavior                                                     |
| ---------------- | -------------------- | --------------------------------| ------------------------------------------------------------ |
| POST             | `/children/add`      | `Authentication & Authorization`| Register a new child and activate their subscription.        |
| POST             | `/renewSubscription` | `Authentication`| Renew child subscription                                     |
| GET              | `/parent/check-child/:idNumber`| `-` | check if the child already exists in the system or not.      |
| POST             | `/parent/add-child`  | `-`| Submit a child registration request by a parent.             |
| POST             | `/parent/renew-subscription`| `-`| Submit a subscription renewal request by a parent.    |
| GET              | `/children/:id`      | `Authentication & Authorization`| Get one child.                                               |
| GET              | `/confirmedChildren` | `Authentication & Authorization`| Get confirmed children                                       |
| GET              | `/waitingChildren`   | `Authentication & Authorization`| Get waiting children.                                        |
| PUT              | `/confirmMany`       | `Authentication`| Confirm many children                                        |
| DELETE           | `/deleteMany`        | `Authentication & Authorization`| Delete many children.                                        |

* **Events Route**

| HTTP METHOD      | Paths                | Permissions                     | Behavior                                                     |
| ---------------- | -------------------- | --------------------------------| ------------------------------------------------------------ |
| POST             | `/createEvent`       | `Authentication`                | create new event or news                                     |
| GET              | `/eventsAndNews`     | `Authentication`                | Get all events and news                                      |
| PUT              | `/eventEdit/:id`     | `Authentication`                | Update event or news                                         |
| DELETE           | `/eventDelete/:id`   | `-`                             | Update event or news                                         |

* **Attendance Route**
  
| HTTP METHOD      | Paths                  | Permissions                     | Behavior                                                     |
| ---------------- | -----------------------| --------------------------------| ------------------------------------------------------------ |
| POST             | `/employee/check-in`   | `Authentication`                | Employee attendance check-in                                 |
| GET              | `/employeesAttendance` | `Authentication`                | Get employees attendance by date                             |
| GET              | `/MunthlyEmployeesAttendance` | `Authentication`| Get employees attendance monthly                                      |
| GET              | `/director/attendance/daily`  | `Authentication`| Get director daily staff attendance                                   |
| GET              | `/director/attendance/monthly`| `Authentication`| Get director monthly staff attendance                                 |
| POST              | `/childCheckIn`        | `Authentication`                | Teacher check-in children attendance                         |

* **Branch Route**

| HTTP METHOD      | Paths                | Permissions     | Behavior                                                     |
| ---------------- | -------------------- | ----------------| ------------------------------------------------------------ |
| POST             | `/newBranch`         | `Authentication`| Add a new branch                                             |
| GET              | `/allBranchs`        | `Authentication`| Get all branches                                             |
| GET              | `/allBranchs`        | `Authentication`| Get all branches                                             |

* **Classes Route**

| HTTP METHOD      | Paths                | Permissions     | Behavior                                                     |
| ---------------- | -------------------- | ----------------| ------------------------------------------------------------ |
| POST             | `/addClassroom`      | `Authentication & Authorization`| Create classroom by teacher                  |
| POST             | `/addChildClassroom` | `Authentication`| Add children to classroom                                    |
| GET              | `/TeacherClassrooms` | `Authentication`| Get teacher classrooms                                       |
| GET              | `/classrooms/:id`    | `Authentication`| Get classroom details.                                       |
| GET              | `/ChildrenWhithoutClasses` | `Authentication`| Get the cheldren of the current teacher who dont have class.|

* **Dashboard State Route**

| HTTP METHOD      | Paths                | Permissions                     | Behavior                                                     |
| ---------------- | -------------------- | --------------------------------| ------------------------------------------------------------ |
| GET              | `/dashboardState`    | `Authentication`                | dashboard statistics, recent events, and financial chart data.|

* **Money Route**

| HTTP METHOD      | Paths                | Permissions                     | Behavior                                                     |
| ---------------- | -------------------- | --------------------------------| ------------------------------------------------------------ |
| POST             | `/createPayment`     | `Authentication`                | Create new payment.                                          |
| POST             | `/createExpenses`    | `Authentication`                | Create new expenses.                                         |
| POST             | `/deletePayments`    | `Authentication`                | Delete one payment.                                          |
| GET              | `/allExpenses`       | `Authentication`                | Get all expenses                                             |
| POST             | `/deleteExpenses`    | `Authentication`                | Delete one expenses                                          |
| GET              | `/allIncoming`       | `Authentication`                | Get all payments                                             |

* **Subscription Route**

| HTTP METHOD      | Paths                  | Permissions                     | Behavior                                                   |
| ---------------- | -----------------------| --------------------------------| ---------------------------------------------------------- |
| POST             | `/subscription/add`    | `Authentication & Authorization`| Add new subscription                                       |
| PUT              | `/subscription/update/:id`| `Authentication & Authorization`| Update the subscription                                 |
| GET              | `/subscription/all`    | `Authentication & Authorization`| get all the subscriptions                                  |
| GET              | `/mySubscription`      | `Authentication & Authorization`| Get subscriptions for current user                         |
| GET              | `/toggleSubscriptionStatus/:id` | `Authentication`| Toggle subscription status (Active or not)                        |
| GET              | `/allSubscription`      | `-`| Get all the subscriptions for parents                                                  |

* **Dashboard State Route**

| HTTP METHOD      | Paths                | Permissions                     | Behavior                                                     |
| ---------------- | -------------------- | --------------------------------| ------------------------------------------------------------ |
| GET              | `/dashboardState`    | `Authentication`                | dashboard statistics, recent events, and financial chart data.|


# 📌 Notes
* All dates are standardized to Asia/Riyadh time.
* Every role has its own level of access.

# Linkes
**Project Trello Board:** [Project Board](https://trello.com/b/unqYEG1G/wahat-al-marefa)

**client Side:**
* childcare-dashboard: [Childcare-Dashboard](https://github.com/RaghadAlquni/childcare/tree/main/childcare-dashboard)
* childcare-website: [Childcare-website](https://github.com/RaghadAlquni/childcare/tree/main/clientnext)
* 
**Deployment:** 
* childcare-dashboard: [Childcare-Dashboard](https://childcare-7crg.vercel.app/)
* childcare-website:[Childcare-website](https://childcare-x251.vercel.app/)

<div align="center">

# 🫱🏼‍🫲🏻 Contributing 
  Pull requests are welcome!
  
  If you’d like to suggest improvements or report issues, feel free to open an Issue.

**Developer 🧑‍💻**

Raghad Alquni

Full-Stack Developer — Next.js, React, Node.js, MongoDB.

**Support the Project ⭐**

If you like this project, please give it a ⭐ on GitHub, it helps a lot!
</div>
