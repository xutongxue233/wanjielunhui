import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Button,
  Card,
  ProgressBar,
  Modal,
  Input,
  Tabs,
  Badge,
  Tooltip,
  Divider,
  Spinner,
} from './index';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
  });

  it('applies size classes correctly', () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-lg');
  });

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick handler', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies fullWidth class', () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-full-width');
  });
});

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Card title="Card Title">Content</Card>);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('applies padding class', () => {
    const { container } = render(<Card padding="lg">Content</Card>);
    expect(container.firstChild).toHaveClass('card-padding-lg');
  });

  it('applies variant class', () => {
    const { container } = render(<Card variant="elevated">Content</Card>);
    expect(container.firstChild).toHaveClass('card-elevated');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Card onClick={handleClick}>Clickable</Card>);
    fireEvent.click(screen.getByText('Clickable'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('ProgressBar', () => {
  it('renders with correct percentage', () => {
    const { container } = render(<ProgressBar current={50} max={100} />);
    const bar = container.querySelector('.progress-bar');
    expect(bar).toHaveStyle({ width: '50%' });
  });

  it('shows label and text', () => {
    render(<ProgressBar current={25} max={100} label="Progress" />);
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('25 / 100')).toBeInTheDocument();
  });

  it('applies type class', () => {
    const { container } = render(<ProgressBar current={50} max={100} type="hp" />);
    expect(container.querySelector('.progress-bar')).toHaveClass('progress-hp');
  });

  it('applies size class', () => {
    const { container } = render(<ProgressBar current={50} max={100} size="lg" />);
    expect(container.querySelector('.progress-container')).toHaveClass('progress-lg');
  });

  it('clamps percentage between 0 and 100', () => {
    const { container } = render(<ProgressBar current={150} max={100} />);
    const bar = container.querySelector('.progress-bar');
    expect(bar).toHaveStyle({ width: '100%' });
  });
});

describe('Modal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}}>
        Content
      </Modal>
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders content when open', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        Modal Content
      </Modal>
    );
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Modal Title">
        Content
      </Modal>
    );
    expect(screen.getByText('Modal Title')).toBeInTheDocument();
  });

  it('calls onClose when backdrop clicked', () => {
    const handleClose = vi.fn();
    const { container } = render(
      <Modal isOpen={true} onClose={handleClose}>
        Content
      </Modal>
    );
    fireEvent.click(container.querySelector('.modal-backdrop')!);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        Content
      </Modal>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

describe('Input', () => {
  it('renders input element', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Input label="Username" />);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('shows hint when no error', () => {
    render(<Input hint="Enter your email" />);
    expect(screen.getByText('Enter your email')).toBeInTheDocument();
  });

  it('applies error class when error provided', () => {
    render(<Input error="Error" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveClass('input-error');
  });
});

describe('Tabs', () => {
  const items = [
    { key: 'tab1', label: 'Tab 1' },
    { key: 'tab2', label: 'Tab 2' },
    { key: 'tab3', label: 'Tab 3', disabled: true },
  ];

  it('renders all tabs', () => {
    render(<Tabs items={items} activeKey="tab1" onChange={() => {}} />);
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('marks active tab', () => {
    render(<Tabs items={items} activeKey="tab1" onChange={() => {}} />);
    expect(screen.getByText('Tab 1')).toHaveClass('active');
  });

  it('calls onChange when tab clicked', () => {
    const handleChange = vi.fn();
    render(<Tabs items={items} activeKey="tab1" onChange={handleChange} />);
    fireEvent.click(screen.getByText('Tab 2'));
    expect(handleChange).toHaveBeenCalledWith('tab2');
  });

  it('does not call onChange for disabled tab', () => {
    const handleChange = vi.fn();
    render(<Tabs items={items} activeKey="tab1" onChange={handleChange} />);
    fireEvent.click(screen.getByText('Tab 3'));
    expect(handleChange).not.toHaveBeenCalled();
  });
});

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Status</Badge>);
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('applies type class', () => {
    render(<Badge type="success">Success</Badge>);
    expect(screen.getByText('Success')).toHaveClass('badge-success');
  });

  it('applies variant class for realm', () => {
    render(<Badge variant="realm" type="jindan">Golden Core</Badge>);
    expect(screen.getByText('Golden Core')).toHaveClass('badge-realm');
  });
});

describe('Tooltip', () => {
  it('renders children and content', () => {
    render(<Tooltip content="Tooltip text">Hover me</Tooltip>);
    expect(screen.getByText('Hover me')).toBeInTheDocument();
    expect(screen.getByText('Tooltip text')).toBeInTheDocument();
  });
});

describe('Divider', () => {
  it('renders with divider class', () => {
    const { container } = render(<Divider />);
    expect(container.firstChild).toHaveClass('divider-xian');
  });
});

describe('Spinner', () => {
  it('renders svg element', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('applies size class', () => {
    const { container } = render(<Spinner size="lg" />);
    expect(container.querySelector('svg')).toHaveClass('h-8', 'w-8');
  });
});
