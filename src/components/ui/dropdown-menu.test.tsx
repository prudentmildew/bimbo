import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';

afterEach(cleanup);

function TestDropdown({ onSelect }: { onSelect?: (item: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button type="button">Open Menu</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => onSelect?.('edit')}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onSelect?.('delete')}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe('DropdownMenu', () => {
  it('opens when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<TestDropdown />);

    expect(screen.queryByText('Edit')).not.toBeInTheDocument();

    await user.click(screen.getByText('Open Menu'));
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('closes when trigger is clicked again', async () => {
    const user = userEvent.setup();
    render(<TestDropdown />);

    await user.click(screen.getByText('Open Menu'));
    expect(screen.getByText('Edit')).toBeInTheDocument();

    await user.click(screen.getByText('Open Menu'));
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });

  it('calls onSelect when item is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<TestDropdown onSelect={onSelect} />);

    await user.click(screen.getByText('Open Menu'));
    await user.click(screen.getByText('Edit'));

    expect(onSelect).toHaveBeenCalledWith('edit');
  });

  it('closes after item selection', async () => {
    const user = userEvent.setup();
    render(<TestDropdown />);

    await user.click(screen.getByText('Open Menu'));
    await user.click(screen.getByText('Edit'));

    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    render(<TestDropdown />);

    await user.click(screen.getByText('Open Menu'));
    expect(screen.getByText('Edit')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    });
  });

  it('supports keyboard navigation with arrow keys', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<TestDropdown onSelect={onSelect} />);

    await user.click(screen.getByText('Open Menu'));

    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(screen.getByText('Edit'));

    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(screen.getByText('Delete'));

    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith('delete');
  });

  it('closes on click outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <span>Outside</span>
        <TestDropdown />
      </div>,
    );

    await user.click(screen.getByText('Open Menu'));
    expect(screen.getByText('Edit')).toBeInTheDocument();

    await user.click(screen.getByText('Outside'));
    await waitFor(() => {
      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    });
  });

  it('renders label and separator', async () => {
    const user = userEvent.setup();
    render(<TestDropdown />);

    await user.click(screen.getByText('Open Menu'));

    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(document.querySelector('.dropdown-menu-separator')).toBeInTheDocument();
  });
});
