export class LoginPlaywright {
  /**
   * @param {import('playwright').Page} page
   */
  constructor(page, email, password) {
    this.page = page;
    this.email = email;
    this.password = password;
  }

  async getStarted() {
    await this.page.goto('http://localhost:5173/login');

    await this.page.getByTestId('email').fill(this.email);
    await this.page.getByTestId('password').fill(this.password);

    await Promise.all([
      this.page.waitForLoadState('networkidle'),
      this.page.getByTestId('send').click()
    ]);
  }
}

// module.exports = { LoginPlaywright };