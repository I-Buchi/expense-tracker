# 🚀 Expense Tracker - AWS CI/CD Automated Deployment

[![Live Demo](https://img.shields.io/badge/Demo-Live-success?style=for-the-badge&logo=amazon-aws)](http://expense-tracker-env.eba-rvpspmi5.us-east-1.elasticbeanstalk.com)
[![GitHub](https://img.shields.io/badge/Code-GitHub-black?style=for-the-badge&logo=github)](https://github.com/I-Buchi/expense-tracker)
[![LinkedIn](https://img.shields.io/badge/Connect-LinkedIn-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/onyebuchi-okoli-098376209)

> **Full-stack expense tracking application with automated CI/CD pipeline demonstrating DevOps practices and AWS cloud infrastructure management.**

---

## 🎯 Quick Overview (30-Second Pitch)

**What:** Expense tracker with zero-touch deployment  
**How:** AWS CodePipeline + Elastic Beanstalk + GitHub integration  
**Why:** Demonstrates end-to-end DevOps automation and cloud architecture  
**Status:** ⚠️ Learning/Demo Project → [Production Roadmap](#-production-roadmap)

### Key Achievements
- ✅ **100% Automated Deployments** - Git push → Live in 5 minutes
- ✅ **Multi-Service AWS Integration** - 6 services working seamlessly  
- ✅ **Real Problem-Solving** - [Debugged 4 deployment errors](#-challenges--solutions)
- ✅ **Infrastructure as Code** - Repeatable, version-controlled configuration

---

## 🏗️ Architecture

```
Developer → GitHub → CodePipeline → Elastic Beanstalk → Live Application
                ↓
            S3 Artifacts
```

**Automated Flow:**
1. Code pushed to GitHub `main` branch
2. Webhook triggers AWS CodePipeline automatically
3. Source stage:  Clones repo, creates artifact, stores in S3
4. Deploy stage: Deploys to Elastic Beanstalk, runs health checks
5. Application live in ~5 minutes with automatic rollback on failure

---

## 💻 Tech Stack

### Frontend
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E? logo=javascript&logoColor=black)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)

### AWS Services
![AWS](https://img.shields.io/badge/AWS-232F3E?logo=amazon-aws&logoColor=white)
- **Elastic Beanstalk** - Application hosting & orchestration
- **CodePipeline** - CI/CD automation
- **IAM** - Security & access management
- **S3** - Artifact storage
- **EC2** - Compute instances (managed by EB)
- **CloudFormation** - Infrastructure provisioning

### DevOps
![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white)
- GitHub App Integration
- Infrastructure as Code (. ebextensions)
- Automated Webhooks
- Automatic Rollback on Failure

---

## 🚀 Features

### Application Features
- ➕ Add expenses (description, amount, category, date)
- 📋 View expenses in sortable table format
- 🔍 Filter by category
- 💰 Automatic total calculation
- 🌙 Dark mode toggle
- 📱 Fully responsive design
- ✏️ Custom category support

### DevOps Features
- 🔄 **Automated CI/CD** - Zero manual deployment steps
- 🔐 **IAM Security** - Custom policies following AWS best practices
- 📦 **Artifact Management** - Versioned deployments in S3
- 🔙 **Automatic Rollback** - Failed deployments revert automatically
- 📊 **Health Monitoring** - Elastic Beanstalk health checks
- 📝 **Event Logging** - Complete deployment audit trail
- 🔧 **Infrastructure as Code** - YAML configuration files

---

## 🎥 Demo

### Live Application
**URL:** [http://expense-tracker-env.eba-rvpspmi5.us-east-1.elasticbeanstalk.com](http://expense-tracker-env.eba-rvpspmi5.us-east-1.elasticbeanstalk.com)

### Try It Out: 
1. Add an expense (e.g., "Lunch" - $15.50 - Food)
2. Filter by category to view specific expense types
3. Toggle dark mode for different viewing preferences
4. View automatic total calculations

---

## 🔧 Local Development

### Prerequisites
```bash
node --version  # v20.x or higher required
npm --version   # v9.x or higher required
git --version   # v2.x or higher required
```

### Quick Start
```bash
# Clone repository
git clone https://github.com/I-Buchi/expense-tracker.git
cd expense-tracker

# Install dependencies
npm install

# Start development server
npm start

# Open browser
http://localhost:8080
```

### Available Scripts
```bash
npm start       # Start production server
npm run dev     # Start with nodemon (auto-reload)
npm test        # Run tests (coming in v2.0)
```

---

## 🔥 Challenges & Solutions

### Real Problems I Solved During Deployment

<details>
<summary><strong>1️⃣ IAM Permissions Error</strong> - CodePipeline couldn't deploy to Elastic Beanstalk</summary>

**Error Message:**
```
The provided role does not have the 
elasticbeanstalk:CreateApplicationVersion permission
```

**Root Cause:**  
Auto-generated CodePipeline service role lacked cross-service permissions for Elastic Beanstalk operations.

**Solution:**  
Created custom inline IAM policy granting necessary Elastic Beanstalk, S3, EC2, and CloudFormation permissions to the service role.

**Key Learning:**  
AWS implements principle of least privilege by default.  Cross-service permissions must be explicitly granted, not assumed. 

**Time to Resolve:** ~15 minutes

</details>

<details>
<summary><strong>2️⃣ YAML Syntax Error</strong> - Configuration file validation failed</summary>

**Error Message:**
```
Invalid YAML:  mapping values are not allowed here 
in 'reader', line 4, column 48
```

**Root Cause:**  
Extra space after colon in `.ebextensions/nodejs.config` (double space instead of single space).

**Solution:**  
Fixed YAML indentation by removing extra whitespace.  YAML is whitespace-sensitive and requires exactly one space after colons for key-value pairs.

**Key Learning:**  
Always use YAML linters (yamllint, VS Code extensions) before committing configuration files.  Whitespace errors are easy to miss visually.

**Time to Resolve:** ~5 minutes

</details>

<details>
<summary><strong>3️⃣ Invalid Configuration Parameter</strong> - Unknown parameter:  NodeCommand</summary>

**Error Message:**
```
Unknown or duplicate parameter: NodeCommand
"option_settings" in configuration files failed validation
```

**Root Cause:**  
Used invalid `NodeCommand` parameter that doesn't exist in Elastic Beanstalk's Node.js platform configuration.

**Solution:**  
Simplified configuration to only use environment variables.  Elastic Beanstalk automatically detects Node.js applications and reads the start script from `package.json`.

**Key Learning:**  
Leverage platform defaults instead of over-configuring. AWS platforms are designed to auto-detect and configure common scenarios.

**Time to Resolve:** ~10 minutes

</details>

<details>
<summary><strong>4️⃣ Pipeline Configuration Complexity</strong> - Multiple setup decisions without clear guidance</summary>

**Challenge:**  
Choosing between pipeline types (V1/V2), execution modes (QUEUED/PARALLEL), GitHub connection methods (OAuth vs GitHub App), and understanding service role requirements.

**Solution:**  
Adopted methodical, research-driven approach: 
- Consulted AWS documentation for each decision point
- Selected V2 pipeline (recommended, enhanced features)
- Chose QUEUED execution mode (prevents race conditions)
- Used GitHub App (more secure than OAuth tokens)

**Key Learning:**  
AWS documentation + community best practices = informed architectural decisions. Taking time to research upfront prevents issues later.

**Time Invested:** ~30 minutes

</details>

**Total Troubleshooting Time:** ~60 minutes  
**Value Gained:** Each error taught more about AWS service integration than any tutorial could provide 💡

---

## ⚠️ Important Disclaimer

### Current Status:  Learning/Demo Project (v1.0)

This project **intentionally prioritizes CI/CD demonstration over production-ready application code.**

#### Known Limitations (By Design)

| Aspect | Current (v1.0) | Production Required |
|--------|---------------|-------------------|
| **Data Persistence** | ❌ In-memory (resets on restart) | ✅ PostgreSQL/MongoDB required |
| **Authentication** | ❌ No user accounts | ✅ JWT + bcrypt hashing |
| **Authorization** | ❌ Public access | ✅ Role-based access control |
| **Input Validation** | ⚠️ Basic server-side only | ✅ Comprehensive sanitization |
| **Testing** | ❌ No automated tests | ✅ 80%+ code coverage |
| **Logging** | ⚠️ Console. log only | ✅ Winston/structured logging |
| **Monitoring** | ⚠️ Basic health checks | ✅ APM + CloudWatch alerts |
| **Security Headers** | ⚠️ Minimal (CORS only) | ✅ Helmet. js + rate limiting |
| **API Documentation** | ❌ None | ✅ Swagger/OpenAPI |
| **Error Handling** | ⚠️ Basic | ✅ Comprehensive middleware |

#### Suitable For: 
✅ Learning AWS services and CI/CD concepts  
✅ Understanding DevOps automation workflows  
✅ Portfolio demonstration of infrastructure skills  
✅ Interview discussions about cloud architecture  
✅ Educational workshops and tutorials  

#### NOT Suitable For: 
❌ Production deployment with real user data  
❌ Multi-user environments requiring data isolation  
❌ Security-sensitive operations  
❌ Commercial or revenue-generating applications  
❌ Compliance-required environments (HIPAA, SOC 2, etc.)  

---

## 🎯 Production Roadmap

### Version 2.0 - Production Ready (Planned)

#### Phase 1: Core Infrastructure
- [ ] **Database Layer**
  - PostgreSQL via AWS RDS
  - Sequelize ORM for data modeling
  - Database migration scripts
  - Connection pooling for performance
  - Indexes for query optimization

- [ ] **Authentication System**
  - JWT tokens (access + refresh)
  - User registration with email verification
  - Secure login/logout endpoints
  - Password hashing with bcrypt
  - Password reset functionality

#### Phase 2: Security & Testing
- [ ] **Security Hardening**
  - Helmet.js security headers
  - Rate limiting (express-rate-limit)
  - Input sanitization (validator + xss)
  - HTTPS enforcement
  - CORS policy refinement
  - SQL injection prevention

- [ ] **Comprehensive Testing**
  - Unit tests (Jest)
  - Integration tests (Supertest)
  - E2E tests (Cypress)
  - 80%+ code coverage target
  - CI pipeline integration

#### Phase 3: Production Features
- [ ] **Monitoring & Logging**
  - Winston structured logging
  - Error tracking (Sentry integration)
  - CloudWatch Logs integration
  - Custom CloudWatch metrics
  - Performance monitoring (APM)

- [ ] **API Improvements**
  - Pagination for large datasets
  - Advanced filtering options
  - Sorting capabilities
  - API versioning (/api/v1/)
  - Swagger/OpenAPI documentation
  - Request validation middleware

### Version 3.0 - Enterprise Grade (Future)
- [ ] OAuth 2.0 (Google, GitHub login)
- [ ] Two-factor authentication (2FA)
- [ ] Redis caching layer
- [ ] Export features (CSV, PDF, Excel)
- [ ] Budget limits with email alerts
- [ ] Recurring expense automation
- [ ] Multi-currency support
- [ ] Advanced data visualization
- [ ] Comprehensive audit logging
- [ ] Multi-tenancy architecture
- [ ] Containerization (Docker)
- [ ] Kubernetes deployment option

---

## 📚 Documentation

- **[Full Deployment Guide](docs/DEPLOYMENT.md)** - Complete AWS setup walkthrough
- **[Error Resolution Log](docs/ERRORS.md)** - All issues encountered & solutions
- **[Architecture Decisions](docs/ARCHITECTURE.md)** - Design choices explained
- **[API Documentation](docs/API.md)** - Endpoints & examples (v2.0)
- **[Contributing Guide](docs/CONTRIBUTING.md)** - How to contribute

---

## 📦 Deployment

### Automated Deployment (Current)

```bash
# Simply push to main branch
git add .
git commit -m "Your feature/fix description"
git push origin main

# Pipeline automatically: 
# 1. Detects push via GitHub webhook
# 2. Clones repository and creates artifact
# 3. Stores artifact in S3 bucket
# 4. Deploys to Elastic Beanstalk environment
# 5. Runs health checks and validation
# 6. Goes live in ~5 minutes ✅
# 7. Automatic rollback on failure 🔙
```

### Manual Deployment (Alternative)

<details>
<summary>Click to expand manual deployment steps</summary>

```bash
# Install Elastic Beanstalk CLI
pip install awsebcli

# Initialize EB in your project
eb init -p node. js expense-tracker

# Create environment (first time only)
eb create expense-tracker-env

# Deploy updates
eb deploy

# Open application in browser
eb open

# View logs
eb logs

# Check environment status
eb status
```
</details>

---

## 🤝 Contributing

Contributions, suggestions, and feedback are welcome!  This is a learning project, so improvements are appreciated.

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Areas for Improvement
- 🐛 Bug fixes and issue resolution
- ✨ New features and enhancements
- 📝 Documentation improvements
- 🧪 Test coverage expansion
- 🔒 Security enhancements
- ⚡ Performance optimizations
- 🎨 UI/UX improvements

---

## 📊 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/I-Buchi/expense-tracker)
![GitHub last commit](https://img.shields.io/github/last-commit/I-Buchi/expense-tracker)
![GitHub issues](https://img.shields.io/github/issues/I-Buchi/expense-tracker)
![GitHub stars](https://img.shields.io/github/stars/I-Buchi/expense-tracker)

- **Lines of Code:** ~800
- **AWS Services Integrated:** 6
- **Average Deployment Time:** ~5 minutes
- **Automation Level:** 100%
- **Errors Debugged:** 4
- **Total Development Time:** ~40 hours
- **Status:** ✅ v1.0 Complete | 🚧 v2.0 In Progress

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**TL;DR:** You can freely use, modify, and distribute this project with attribution.

---

## 👤 Author

**Onyebuchi John Okoli (I-Buchi)**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/onyebuchi-okoli-098376209)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github)](https://github.com/I-Buchi)
[![Email](https://img.shields.io/badge/Email-Contact-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:LpvasJohn@gmail.com)

### About Me
Full-stack developer passionate about cloud architecture, DevOps automation, and building scalable applications. Currently focusing on AWS services, CI/CD pipelines, and modern web technologies. 

**Core Skills:** Node.js | Express. js | AWS | CI/CD | DevOps | JavaScript | Cloud Architecture

**Currently Learning:** React | Docker | Kubernetes | PostgreSQL | Advanced AWS Services

---

## 🙏 Acknowledgments

- **AWS Documentation** - Comprehensive guides and best practices
- **DevOps Community** - Invaluable troubleshooting help and inspiration
- **Stack Overflow** - Solutions to specific technical challenges
- **GitHub Community** - Open source inspiration and learning resources

---

## 📞 Questions or Feedback? 

Have questions about the implementation?  Want to discuss AWS architecture or production deployment strategies? 

- 💬 **Open an Issue:** [GitHub Issues](https://github.com/I-Buchi/expense-tracker/issues)
- 💼 **Connect on LinkedIn:** [Onyebuchi Okoli](https://www.linkedin.com/in/onyebuchi-okoli-098376209)
- 📧 **Email Me:** [LpvasJohn@gmail. com](mailto:LpvasJohn@gmail.com)

**I'm always happy to discuss:**
- AWS architecture and best practices
- CI/CD pipeline optimization
- Troubleshooting deployment issues
- Migration strategies from demo to production
- DevOps automation techniques

---

## ⭐ Show Your Support

If this project helped you learn about AWS CI/CD pipelines or inspired your own project: 

- ⭐ **Star this repository** to show appreciation
- 🍴 **Fork it** for your own use and experimentation
- 📢 **Share it** with others who might benefit
- 💬 **Leave feedback** via issues or LinkedIn
- 🔗 **Mention it** in your own projects or blog posts

Every star and fork motivates continued improvement and documentation!  🚀

---

<div align="center">

### 🚀 Built with passion for learning and sharing knowledge

**From learning project to production-ready application**

![AWS](https://img.shields.io/badge/AWS-Powered-FF9900?logo=amazon-aws&logoColor=white)
![DevOps](https://img.shields.io/badge/DevOps-Automated-success?logo=github-actions)
![Open Source](https://img.shields.io/badge/Open-Source-blue?logo=open-source-initiative)

**[Live Demo](http://expense-tracker-env.eba-rvpspmi5.us-east-1.elasticbeanstalk.com)** • **[Documentation](docs/)** • **[Report Bug](https://github.com/I-Buchi/expense-tracker/issues)** • **[Request Feature](https://github.com/I-Buchi/expense-tracker/issues)**

---

*Last Updated: January 2026*  
*Version: 1.0.0*  
*Status: ✅ Demo Complete | 🚧 Production In Progress*

</div>
