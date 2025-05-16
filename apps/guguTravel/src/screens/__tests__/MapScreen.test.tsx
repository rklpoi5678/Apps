import React from 'react';
import { render } from '@testing-library/react-native';
import { MapScreen } from '../MapScreen';
import { useTourStore } from '../../store/useTourStore';

jest.mock('../../store/useTourStore');

describe('MapScreen', () => {
  it('renders correctly', () => {
    (useTourStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        tours: [
          {
            id: '1',
            title: 'Test Tour',
            description: 'Test Description',
            location: {
              latitude: 37.5665,
              longitude: 126.9780,
            },
          },
        ],
      })
    );

    const { getByTestId } = render(<MapScreen />);
    expect(getByTestId('map-view')).toBeTruthy();
  });
}); 