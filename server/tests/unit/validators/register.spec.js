import faker from 'faker'
import validators from '../../../validators'
import { User } from '../../../database/models'

const { RegisterUserValidator} = validators

describe('The RegisterUserValidator class',() => {
    describe('The validateName function ',()=>{
        test('The validateName function adds a required error to the errors array if name is not provided', ()=>{
            
            // ARRANGE

            const validator = new RegisterUserValidator({
                email: 'bahdcoder@gmail.com'
            })

            //  ACTION
            validator.validateName()

            // ASSERTION
            const { errors } = validator

            //console.log(errors)
            expect(errors).toEqual([
                'The name is required.'
            ])

        })

        test('Adds an error if name is less than 5 characters',() => {
            // ARRANGE
            const validator = new RegisterUserValidator({
                name: 'haza'
            })
            // ACTION
            validator.validateName()

            // ASSERTION
            expect(validator.errors).toEqual([
                'The name must be longer than 5 characters.'
            ])
        })

    })
    describe('The validatePassword function ', () => {
        test('adds a required error to the errors array if password is not provided', () => {
            // ARRANGE
            const validator = new RegisterUserValidator({
              email: 'bahdcoder@gmail.com'
            })
      
            // ACTION
            validator.validatePassword()
      
            // ASSERTION
            const { errors } = validator
            expect(errors).toEqual([
              'The password is required.'
            ])
        })

        test('adds an error if password is less than 6 characters', () => {
            // ARRANGE
            const validator = new RegisterUserValidator({
              password: 'bahd'
            })
            // ACTION
      
            validator.validatePassword()
      
            // ASSERTION
            expect(validator.errors).toEqual([
              'The password must be longer than 5 characters.'
            ])
        })
    })
    
    describe('The validateEmail function', () => {
        test('adds a required error if the email is not provided', async () => {
          const validator = new RegisterUserValidator({
            name: 'bahdcoder'
          })
    
          await validator.validateEmail()
    
          expect(validator.errors).toEqual([
            'The email is required.'
          ])
        })
        test('adds an error if email is invalid', async () => {
          const validator = new RegisterUserValidator({
            email: 'bahdcoder@masd'
          })
    
          await validator.validateEmail()
    
          expect(validator.errors).toEqual([
            'The email must be a valid email address.'
          ])
        })
    
        test('adds an email taken error if user already exists with that email', async () => {
            // DELETE ALL USERS FROM DB
            await User.destroy({ where: {}})
          
            // CREATE NEW USER WITH THIS EMAIL
          const user = await User.create({
            name: 'bahdcoder',
            //email: faker.internet.email(),
            email: 'bahcoder@you.com',
            password: 'password'
          })
    
          // INITIALIZE OUR VALIDATOR
          const validator = new RegisterUserValidator({
            //email: user.email
            email: 'bahcoder@you.com'
          })
    
          await validator.validateEmail()
    
          expect(validator.errors).toEqual([
            'A user with this email already exists.'
          ])
        })
    })

    describe('The isValid function', () => {
        test('returns true if validation passes', async () => {
            // DELETE ALL USERS FROM DB
            await User.destroy({ where: {}})

            // ARRANGE
            const validator = new RegisterUserValidator({
                name: 'bahdcoder',
                email: 'bahdcoder@gmail.com',
                password: 'password'
            })
            // ACTION
            const result = await validator.isValid()

            // ASSERTION
            expect(result).toBe(true)
        })

        test('returns false for invalid data', async () => {
            // DELETE ALL USERS FROM DB
            await User.destroy({ where: {}})

            // ARRANGE
            const validator = new RegisterUserValidator({
                name: 'bahd',
                email: 'bahdcoder@gmail.com',
                password: 'password'
            })
            // ACTION
            const result = await validator.isValid()

            // ASSERTION
            expect(result).toBe(false)
        })
    })


})