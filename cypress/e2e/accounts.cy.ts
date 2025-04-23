/// <reference types="mocha" />

describe('Управление учетными записями', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('должна отображаться главная страница с заголовком', () => {
    cy.get('h1').should('contain', 'Управление учетными записями')
    cy.get('.help-text').should('contain', 'Введите метки через точку с запятой')
  })

  it('должна добавляться новая учетная запись', () => {
    cy.get('.add-btn').click()
    cy.get('.account-form').should('have.length.at.least', 1)
  })

  it('должна правильно работать форма учетной записи', () => {
    cy.get('.add-btn').click()
    
    // Проверяем работу с метками
    cy.get('.account-form').first().within(() => {
      cy.get('div').contains('label', 'Метка').siblings('input').type('тест1;тест2')
      
      // Выбираем тип записи
      cy.get('div').contains('label', 'Тип записи').parent().click()
    })

    // Ищем список в overlay вне контекста формы
    cy.get('.v-overlay-container')
      .find('.v-list-item__content')
      .contains('Локальная')
      .click()
    
    // Возвращаемся к работе с формой
    cy.get('.account-form').first().within(() => {
      // Заполняем логин и пароль через обновленные селекторы
      cy.get('div').contains('label', 'Логин').siblings('input').type('testuser')
    })

    // Проверяем, что данные сохранились
    cy.get('.account-form').first().within(() => {
      cy.get('div').contains('label', 'Логин').siblings('input').should('have.value', 'testuser')
    })
  })

  it('должна удаляться учетная запись', () => {
    cy.get('.add-btn').click()
    cy.get('.account-form').should('have.length.at.least', 1)
    
    // Удаляем запись
    cy.get('.delete-button').first().click()
    cy.get('.account-form').should('have.length', 0)
  })
}) 