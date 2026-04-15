import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';

afterEach(cleanup);

function renderToggleGroup(value = 'a', onValueChange = vi.fn()) {
  render(
    <ToggleGroup type="single" value={value} onValueChange={onValueChange}>
      <ToggleGroupItem value="a">Alpha</ToggleGroupItem>
      <ToggleGroupItem value="b">Beta</ToggleGroupItem>
      <ToggleGroupItem value="c">Gamma</ToggleGroupItem>
    </ToggleGroup>,
  );
  return onValueChange;
}

describe('ToggleGroup keyboard navigation', () => {
  it('moves focus to next item on ArrowRight', async () => {
    const user = userEvent.setup();
    renderToggleGroup('a');

    const alpha = screen.getByRole('radio', { name: 'Alpha' });
    alpha.focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('radio', { name: 'Beta' })).toHaveFocus();
  });

  it('moves focus to previous item on ArrowLeft', async () => {
    const user = userEvent.setup();
    renderToggleGroup('b');

    const beta = screen.getByRole('radio', { name: 'Beta' });
    beta.focus();
    await user.keyboard('{ArrowLeft}');

    expect(screen.getByRole('radio', { name: 'Alpha' })).toHaveFocus();
  });

  it('only the active item has tabIndex=0, others have tabIndex=-1', () => {
    renderToggleGroup('b');

    expect(screen.getByRole('radio', { name: 'Alpha' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('radio', { name: 'Beta' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('radio', { name: 'Gamma' })).toHaveAttribute('tabindex', '-1');
  });

  it('wraps focus from last item to first on ArrowRight', async () => {
    const user = userEvent.setup();
    renderToggleGroup('c');

    const gamma = screen.getByRole('radio', { name: 'Gamma' });
    gamma.focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('radio', { name: 'Alpha' })).toHaveFocus();
  });

  it('wraps focus from first item to last on ArrowLeft', async () => {
    const user = userEvent.setup();
    renderToggleGroup('a');

    const alpha = screen.getByRole('radio', { name: 'Alpha' });
    alpha.focus();
    await user.keyboard('{ArrowLeft}');

    expect(screen.getByRole('radio', { name: 'Gamma' })).toHaveFocus();
  });

  it('calls onValueChange with newly focused item value on ArrowRight', async () => {
    const user = userEvent.setup();
    const onChange = renderToggleGroup('a');

    const alpha = screen.getByRole('radio', { name: 'Alpha' });
    alpha.focus();
    await user.keyboard('{ArrowRight}');

    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('has role="radiogroup" on the container', () => {
    renderToggleGroup();
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });
});
