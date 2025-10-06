import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

type PasswordInputProps = React.ComponentProps<'input'> & {
  toggleAriaLabel?: string;
};

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className,
      toggleAriaLabel = 'Tampilkan/Sembunyikan kata sandi',
      ...props
    },
    ref
  ) => {
    const [show, setShow] = React.useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={show ? 'text' : 'password'}
          className={cn('pr-10', className)}
          {...props}
        />
        <button
          type="button"
          aria-label={show ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          title={toggleAriaLabel}
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground hover:text-foreground"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
