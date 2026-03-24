/**
 * @swagger
 * /user:
 *   post:
 *     tags:
 *       - User
 *     summary: User Registration
 *     description: Create a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - phoneNumber
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePassword123!
 *               phoneNumber:
 *                 type: string
 *                 example: "+1234567890"
 *               referralCode:
 *                 type: string
 *                 example: REF123456
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Email already taken or validation error
 *       500:
 *         description: Server error
 * 
 *   get:
 *     tags:
 *       - User
 *     summary: Get Current User Profile
 *     description: Retrieve the authenticated user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - No token provided
 *       404:
 *         description: User not found
 * 
 *   patch:
 *     tags:
 *       - User
 *     summary: Update User Profile
 *     description: Update the authenticated user's profile information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 * 
 * /user/login:
 *   post:
 *     tags:
 *       - User
 *     summary: User Login
 *     description: Authenticate user and return JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePassword123!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 * 
 * /user/verify:
 *   patch:
 *     tags:
 *       - User
 *     summary: Verify User Email
 *     description: Verify user email with verification code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - verification_code
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               verification_code:
 *                 type: number
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid verification code
 *       404:
 *         description: User not found
 * 
 * /user/forget-pass:
 *   post:
 *     tags:
 *       - User
 *     summary: Forgot Password
 *     description: Send password reset link to user email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Reset link sent to email
 *       404:
 *         description: User not found
 * 
 * /user/change/{id}:
 *   patch:
 *     tags:
 *       - User
 *     summary: Change Password
 *     description: Change user password with reset token
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - confirmPassword
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Passwords do not match
 * 
 * /user/pass:
 *   patch:
 *     tags:
 *       - User
 *     summary: Update Password
 *     description: Update password with old password verification
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       401:
 *         description: Invalid old password
 * 
 * /user/{id}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete User Account
 *     description: Delete a user account
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 * 
 * /users/{id}:
 *   patch:
 *     tags:
 *       - User
 *     summary: Update User Data
 *     description: Update specific user data by admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               total_balance:
 *                 type: number
 *               withdrawable_balance:
 *                 type: number
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: User data updated successfully
 *       404:
 *         description: User not found
 * 
 * /users/ref/{user}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get Referral Code
 *     description: Get user's referral code
 *     parameters:
 *       - in: path
 *         name: user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Referral code retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 referralCode:
 *                   type: string
 * 
 * /users/affiliates:
 *   get:
 *     tags:
 *       - User
 *     summary: Get Affiliated Users
 *     description: Get list of users who joined through your referral
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Affiliated users list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 * 
 * /users/search:
 *   post:
 *     tags:
 *       - User
 *     summary: Search Users
 *     description: Search for users by name, email
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /admin:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Admin Registration
 *     description: Register a new admin account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       400:
 *         description: Email already registered
 * 
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get Admin Profile
 *     description: Retrieve admin profile information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       401:
 *         description: Unauthorized
 * 
 * /admin/login:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Admin Login
 *     description: Authenticate admin user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 admin:
 *                   $ref: '#/components/schemas/Admin'
 *       401:
 *         description: Invalid credentials
 * 
 * /admin/validate/{id}:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Validate Admin
 *     description: Validate admin account
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin validated successfully
 * 
 * /admin/users:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get All Users
 *     description: Retrieve list of all users (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Users list retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 * 
 * /admin/users/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get Single User
 *     description: Retrieve a specific user's details (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 * 
 * /payment:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Upload Payment Options
 *     description: Add new payment method (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - details
 *             properties:
 *               name:
 *                 type: string
 *               details:
 *                 type: string
 *               walletAddress:
 *                 type: string
 *               bankDetails:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment method added successfully
 *       401:
 *         description: Unauthorized
 * 
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get All Payment Methods
 *     description: Retrieve all available payment methods
 *     responses:
 *       200:
 *         description: Payment methods retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaymentMethod'
 * 
 * /method/:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get Single Payment Method
 *     description: Retrieve a specific payment method details
 *     responses:
 *       200:
 *         description: Payment method retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentMethod'
 * 
 * /admin/funds:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get Total Amount Deposited
 *     description: Get total amount of funds deposited by all users
 *     responses:
 *       200:
 *         description: Total deposited amount
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_deposited:
 *                   type: number
 * 
 * /admin/pending:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get Total Pending Amount
 *     description: Get total pending transactions amount
 *     responses:
 *       200:
 *         description: Total pending amount
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_pending:
 *                   type: number
 * 
 * /admin/email/user/{id}:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Send Follow-up Email
 *     description: Send follow-up email to user (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - message
 *             properties:
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /invest:
 *   post:
 *     tags:
 *       - Investment
 *     summary: Create Investment
 *     description: Create a new investment plan for authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - selected_plan
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 5000
 *               selected_plan:
 *                 type: string
 *                 example: "Starter Plan"
 *               interest_percentage:
 *                 type: number
 *                 example: 12.5
 *               payment_method:
 *                 type: string
 *                 example: "cryptoWallet"
 *     responses:
 *       201:
 *         description: Investment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Investment'
 *       400:
 *         description: Invalid investment data
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /deposit:
 *   post:
 *     tags:
 *       - Transaction
 *     summary: Create Deposit Transaction
 *     description: Initiate a deposit transaction
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - payment_method
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 1000
 *               payment_method:
 *                 type: string
 *                 example: "Bitcoin"
 *               wallet_address:
 *                 type: string
 *               payment_proof:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Deposit transaction created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Invalid deposit data
 *       401:
 *         description: Unauthorized
 * 
 * /confirm/{id}:
 *   post:
 *     tags:
 *       - Transaction
 *     summary: Confirm Payment
 *     description: Confirm a deposit payment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["approved", "rejected"]
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment confirmed successfully
 *       404:
 *         description: Transaction not found
 * 
 * /transactions:
 *   get:
 *     tags:
 *       - Transaction
 *     summary: List All Transactions
 *     description: Get all transactions in the system
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transactions list retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 * 
 * /transactions/users:
 *   get:
 *     tags:
 *       - Transaction
 *     summary: Get User Transaction History
 *     description: Get transaction history of authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User transaction history retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized
 * 
 * /transactions/deposit:
 *   get:
 *     tags:
 *       - Transaction
 *     summary: Get Deposit Transactions
 *     description: Get all deposit transactions of authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Deposit transactions retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 * 
 * /pin:
 *   post:
 *     tags:
 *       - Transaction
 *     summary: Create Transaction PIN
 *     description: Create a new transaction PIN for authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pin
 *             properties:
 *               pin:
 *                 type: string
 *                 minLength: 4
 *                 maxLength: 6
 *                 example: "1234"
 *     responses:
 *       201:
 *         description: PIN created successfully
 *       400:
 *         description: Invalid PIN format
 *       401:
 *         description: Unauthorized
 * 
 *   patch:
 *     tags:
 *       - Transaction
 *     summary: Update Payment PIN
 *     description: Update existing payment PIN
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPin
 *               - newPin
 *             properties:
 *               oldPin:
 *                 type: string
 *               newPin:
 *                 type: string
 *     responses:
 *       200:
 *         description: PIN updated successfully
 *       401:
 *         description: Unauthorized or invalid old PIN
 * 
 * /transactions/pin:
 *   post:
 *     tags:
 *       - Transaction
 *     summary: Validate Payment PIN
 *     description: Validate transaction PIN for payment confirmation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pin
 *             properties:
 *               pin:
 *                 type: string
 *     responses:
 *       200:
 *         description: PIN validated successfully
 *       401:
 *         description: Invalid PIN
 */

/**
 * @swagger
 * /withdraw:
 *   post:
 *     tags:
 *       - Withdrawal
 *     summary: Withdraw to Wallet
 *     description: Withdraw funds to user's wallet
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - wallet_address
 *               - payment_method
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 500
 *               wallet_address:
 *                 type: string
 *                 example: "1A1z7agoat2wum5aq3UUvtHELXHeG5Q5tp"
 *               payment_method:
 *                 type: string
 *                 example: "Bitcoin"
 *               pin:
 *                 type: string
 *     responses:
 *       201:
 *         description: Withdrawal request created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Withdraw'
 *       400:
 *         description: Insufficient funds or invalid data
 *       401:
 *         description: Unauthorized
 * 
 *   get:
 *     tags:
 *       - Withdrawal
 *     summary: Get Withdrawal History
 *     description: Get withdrawal history of authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Withdrawal history retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Withdraw'
 *       401:
 *         description: Unauthorized
 * 
 * /withdraw/profit:
 *   post:
 *     tags:
 *       - Withdrawal
 *     summary: Withdraw Profit
 *     description: Withdraw investment profits
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - wallet_address
 *               - payment_method
 *             properties:
 *               amount:
 *                 type: number
 *               wallet_address:
 *                 type: string
 *               payment_method:
 *                 type: string
 *               pin:
 *                 type: string
 *     responses:
 *       201:
 *         description: Profit withdrawal requested
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Withdraw'
 *       400:
 *         description: Insufficient profit balance
 *       401:
 *         description: Unauthorized
 */
