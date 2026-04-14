import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

afterEach(cleanup);

function TestSelect({
  value,
  onValueChange,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Choose..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
      </SelectContent>
    </Select>
  );
}

describe('Select', () => {
  it('renders trigger with placeholder', () => {
    render(<TestSelect />);
    expect(screen.getByText('Choose...')).toBeInTheDocument();
  });

  it('opens dropdown when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<TestSelect />);

    expect(screen.queryByText('Apple')).not.toBeInTheDocument();

    await user.click(screen.getByRole('combobox'));
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('Cherry')).toBeInTheDocument();
  });

  it('selects a value when item is clicked', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TestSelect onValueChange={onValueChange} />);

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('Banana'));

    expect(onValueChange).toHaveBeenCalledWith('banana');
  });

  it('closes after selection', async () => {
    const user = userEvent.setup();
    render(<TestSelect onValueChange={() => {}} />);

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('Apple'));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('displays selected value in trigger', () => {
    render(<TestSelect value="banana" />);
    expect(screen.getByText('banana')).toBeInTheDocument();
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    render(<TestSelect />);

    await user.click(screen.getByRole('combobox'));
    expect(screen.getByText('Apple')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByText('Apple')).not.toBeInTheDocument();
    });
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<TestSelect onValueChange={onValueChange} />);

    await user.click(screen.getByRole('combobox'));

    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(screen.getByText('Apple'));

    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(screen.getByText('Banana'));

    await user.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('banana');
  });

  it('closes on click outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <span>Outside</span>
        <TestSelect />
      </div>,
    );

    await user.click(screen.getByRole('combobox'));
    expect(screen.getByText('Apple')).toBeInTheDocument();

    await user.click(screen.getByText('Outside'));
    await waitFor(() => {
      expect(screen.queryByText('Apple')).not.toBeInTheDocument();
    });
  });

  it('has correct ARIA attributes', async () => {
    const user = userEvent.setup();
    render(<TestSelect value="apple" />);

    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();

    const selectedOption = screen.getByText('Apple').closest('[role="option"]');
    expect(selectedOption).toHaveAttribute('aria-selected', 'true');
  });
});
