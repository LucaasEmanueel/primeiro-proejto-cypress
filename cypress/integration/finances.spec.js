import { format, prepareLocalStorage } from "../support/utils"
/// <reference types= "cypress" />

context('Dev Finances Agilizei', () => {

    //hooks
    //trechos que executa antes e depois do teste

    beforeEach(() =>{
        cy.visit('https://devfinance-agilizei.netlify.app/', {
            onBeforeLoad: (win)=>{
            prepareLocalStorage(win)
            }
        })   
    });
    
    it('Cadastrar Entradas', () => {
        
        //Mapear os elementos que vamos interagir
        // Descrever as Interações com o cypress
        //Adicionar as asserções que nós precisamos

        cy.get('#transaction .button').click() //id + class
        cy.get('#description').type('Mesada') //id
        cy.get('[name=amount]').type(12) //direto pelo atributo
        cy.get('#date').type('2021-03-17') //id
        cy.get('button').contains('Salvar').click() //tipo e valor
        cy.get('#data-table tbody tr').should('have.length',3)
    });

    it('Cadastrar Saídas', () => {
        
        cy.get('#transaction .button').click() //id + class
        cy.get('#description').type('Mesada') //id
        cy.get('[name=amount]').type(-12) //direto pelo atributo
        cy.get('#date').type('2021-03-17') //id
        cy.get('button').contains('Salvar').click() //tipo e valor
        cy.get('#data-table tbody tr').should('have.length',3)
    });

    it('Remover Entradas e Saidas', () => {
        
        
         //Excluindo - Utilizando o pai, depois entrando da imagem e no attr
         cy.get('td.description')
         .contains("Mesada")
         .parent()
         .find('img[onclick*=remove]')
         .click()

        //Excluindo - Utilizando os elementos irmãos e depois buscar imagem e attr
        cy.get('td.description')
            .contains('Suco Kapo')
            .siblings()
            .children('img[onclick*=remove]')
            .click() 
        
        cy.get('#data-table tbody tr').should('have.length',0)

    });

    it('Validar saldo com diversas transações', () => {

         //capturar o texto do total
        //comparar o somatorio de entradas e despesas com o total
        
        //capturar as linhas com as transações
        //formatar esses valores de linhas

        let incomes = 0
        let expenses = 0      

        cy.get('#data-table tbody tr')
            .each(($el, index, $list) => {

                cy.get($el).find('td.income, td.expense').invoke('text').then(text => {
                if(text.includes('-')){
                    expenses += format(text)
                }else{
                    incomes += format(text)
                }
                cy.log(`entradas`,incomes)
                cy.log(`saidas`,expenses)
            })

        })

        cy.get('#totalDisplay').invoke('text').then(text => {
            let formattedTotalDisplay = format(text)
            let expectedTotal = incomes + expenses

            expect(formattedTotalDisplay).to.eq(expectedTotal)
        })
        

    }) ;
});

