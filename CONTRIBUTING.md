# Contributing to Aztec Dark Market

Thank you for your interest in contributing to Aztec Dark Market! This document provides guidelines and instructions for contributing to the project.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [How to Contribute](#how-to-contribute)
4. [Development Workflow](#development-workflow)
5. [Coding Standards](#coding-standards)
6. [Testing Guidelines](#testing-guidelines)
7. [Pull Request Process](#pull-request-process)
8. [Issue Reporting](#issue-reporting)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of background or experience level.

### Expected Behavior

- Be respectful and considerate
- Welcome newcomers and help them get started
- Provide constructive feedback
- Focus on what is best for the project
- Show empathy towards other contributors

### Unacceptable Behavior

- Harassment or discriminatory language
- Personal attacks or trolling
- Publishing others' private information
- Any conduct that could be considered inappropriate in a professional setting

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

1. **Read the documentation:**
   - README.md
   - SETUP.md
   - ARCHITECTURE.md

2. **Set up your development environment:**
   ```bash
   git clone https://github.com/rudazy/Aztec-.git
   cd Aztec-
   npm install
   npm run compile
   ```

3. **Run the tests:**
   ```bash
   npm run test
   ```

### Find an Issue to Work On

- Check the [Issues](https://github.com/rudazy/Aztec-/issues) page
- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to let others know you're working on it

---

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

1. **Bug Fixes**
   - Fix identified bugs
   - Add test cases for the fix
   - Update documentation if needed

2. **New Features**
   - Implement new trading features
   - Add privacy enhancements
   - Improve user experience

3. **Documentation**
   - Fix typos or unclear explanations
   - Add examples and tutorials
   - Improve API documentation

4. **Testing**
   - Write unit tests
   - Add integration tests
   - Improve test coverage

5. **Performance**
   - Optimize proof generation
   - Reduce gas costs
   - Improve note management

---

## Development Workflow

### 1. Fork the Repository

Click the "Fork" button on GitHub to create your own copy.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/Aztec-.git
cd Aztec-
git remote add upstream https://github.com/rudazy/Aztec-.git
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `test/` - Test additions
- `refactor/` - Code refactoring

### 4. Make Your Changes

- Write clean, readable code
- Follow the coding standards
- Add tests for your changes
- Update documentation as needed

### 5. Commit Your Changes

```bash
git add .
git commit -m "Brief description of your changes"
```

Commit message format:
```
<type>: <short description>

<detailed description (optional)>

<footer (optional)>
```

Types:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Test additions/changes
- `refactor:` - Code refactoring
- `style:` - Code formatting
- `chore:` - Build/config changes

Example:
```
feat: Add limit order support to order book

Implemented limit order functionality with price thresholds.
Orders now support both market and limit types with configurable
expiry times.

Closes #123
```

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 7. Create a Pull Request

- Go to your fork on GitHub
- Click "New Pull Request"
- Provide a clear title and description
- Reference any related issues

---

## Coding Standards

### Noir/Smart Contracts

**Style Guidelines:**

1. **Naming Conventions:**
   ```rust
   // Contract names: PascalCase
   contract PrivateOrderBook { }
   
   // Function names: snake_case
   fn place_order() { }
   
   // Variables: snake_case
   let order_amount = 1000;
   
   // Constants: SCREAMING_SNAKE_CASE
   global MAX_ORDERS: Field = 100;
   ```

2. **Documentation:**
   ```rust
   // Document all public functions
   /// Places a new private order on the order book
   /// @param asset_in - Token being sold
   /// @param amount_in - Amount being sold
   /// @return order_hash - Hash of the created order
   fn place_order(...) { }
   ```

3. **Error Handling:**
   ```rust
   // Use descriptive assertion messages
   assert(amount > 0, "Amount must be positive");
   assert(expiry > context.timestamp(), "Order already expired");
   ```

4. **Code Organization:**
   - Group related functions together
   - Separate private and public functions
   - Keep functions focused and concise
   - Use helper functions for complex logic

### JavaScript/TypeScript

**Style Guidelines:**

1. **Use modern JavaScript:**
   ```javascript
   // Use const/let, not var
   const amount = Fr.fromString('1000');
   
   // Use async/await
   const result = await contract.methods.place_order(...).send().wait();
   
   // Use arrow functions
   const processOrder = (order) => { ... };
   ```

2. **Error Handling:**
   ```javascript
   try {
     await contract.methods.place_order(...).send().wait();
   } catch (error) {
     console.error('Order placement failed:', error);
     throw error;
   }
   ```

3. **Comments:**
   ```javascript
   // Explain WHY, not WHAT
   // Lock assets before placing order to prevent double-spending
   await escrow.methods.lock_assets(...).send().wait();
   ```

---

## Testing Guidelines

### Writing Tests

1. **Test Structure:**
   ```rust
   #[test]
   fn test_place_order() {
       // Arrange: Set up test data
       let trader = AztecAddress::from_field(1);
       let amount = 1000;
       
       // Act: Execute the function
       contract.place_order(...);
       
       // Assert: Verify the result
       assert(order_placed, "Order should be placed");
   }
   ```

2. **Test Coverage:**
   - Test happy paths
   - Test error cases
   - Test edge cases
   - Test authorization checks
   - Test privacy guarantees

3. **Test Naming:**
   ```rust
   #[test]
   fn test_place_order_succeeds_with_valid_params() { }
   
   #[test]
   fn test_place_order_fails_with_zero_amount() { }
   
   #[test]
   fn test_cancel_order_fails_for_non_owner() { }
   ```

### Running Tests

```bash
# Run all tests
npm run test

# Run specific test file
aztec-nargo test --test-name test_orderbook
```

---

## Pull Request Process

### Before Submitting

**Checklist:**
- [ ] Code compiles without errors
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] Code follows style guidelines
- [ ] Commit messages are clear
- [ ] No merge conflicts with main branch

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Related Issues
Closes #123

## Testing
Describe how you tested your changes.

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have added tests for my changes
- [ ] All tests pass locally
- [ ] I have updated the documentation
```

### Review Process

1. **Automated Checks:**
   - Code compilation
   - Test execution
   - Linting

2. **Manual Review:**
   - Code quality
   - Logic correctness
   - Security implications
   - Privacy considerations

3. **Feedback:**
   - Address reviewer comments
   - Make requested changes
   - Push updates to your branch

4. **Approval:**
   - At least one maintainer approval required
   - All checks must pass
   - No unresolved comments

5. **Merge:**
   - Maintainer will merge your PR
   - Your contribution will be credited

---

## Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Deploy contracts
2. Call function X with parameters Y
3. Observe error

**Expected behavior**
What you expected to happen.

**Actual behavior**
What actually happened.

**Environment:**
- OS: [e.g., Windows 10]
- Node version: [e.g., 18.0.0]
- Aztec version: [e.g., 0.50.0]

**Additional context**
Any other relevant information.
```

### Feature Requests

Use the feature request template:

```markdown
**Is your feature request related to a problem?**
Description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Any other relevant information.
```

---

## Security Issues

**DO NOT** report security vulnerabilities publicly!

Instead:
1. Email security concerns to: [ludarep1@dmail.ai]
2. Provide detailed information
3. Allow time for investigation
4. Coordinate disclosure timing

---

## Questions?

If you have questions about contributing:

- Open a [Discussion](https://github.com/rudazy/Aztec-/discussions)
- Join our [t.me/ludarep]
- Check existing documentation
- Ask in an issue

---

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Recognized in project documentation

Thank you for contributing to Aztec Dark Market! 🚀

---

**Last Updated:** October 2025