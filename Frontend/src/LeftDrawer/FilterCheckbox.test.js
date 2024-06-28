import React, {act} from 'react';
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import FilterCheckbox from './FilterCheckbox';


describe('FilterCheckbox', () => {

  let realHandleChange;
  let mockedHandleChange;
  beforeEach(() => {

  })

  test('renders', () => {
      render(<FilterCheckbox/>);
      screen.getByRole('checkbox');
  })
  test('toggles checked and unchecked', () => {
      const tagName='Test label'
      const tagId='69420'
      render(<FilterCheckbox text={tagName} key={tagId} tagId={tagId}/>);

      const checkbox = screen.getByRole('checkbox');
      console.log(checkbox);

      expect(checkbox.checked).toBeFalsy()
      
      // screen.debug();

      fireEvent(
          checkbox,
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
          }),
        )

      // screen.debug();

      expect(checkbox.checked).toBeTruthy()
  })
})
