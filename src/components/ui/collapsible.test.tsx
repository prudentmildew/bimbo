import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';

afterEach(cleanup);

describe('Collapsible', () => {
  it('shows content when open', () => {
    render(
      <Collapsible open onOpenChange={() => {}}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>,
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('hides content when closed', () => {
    render(
      <Collapsible open={false} onOpenChange={() => {}}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>,
    );

    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('calls onOpenChange when trigger is clicked', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Collapsible open={false} onOpenChange={onOpenChange}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>,
    );

    await user.click(screen.getByText('Toggle'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('works when trigger is nested inside wrapper elements', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Collapsible open={false} onOpenChange={onOpenChange}>
        <div className="wrapper">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        </div>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>,
    );

    await user.click(screen.getByText('Toggle'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('sets aria-expanded on the trigger', () => {
    render(
      <Collapsible open onOpenChange={() => {}}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>,
    );

    expect(screen.getByText('Toggle')).toHaveAttribute('aria-expanded', 'true');
  });
});
