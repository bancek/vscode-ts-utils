# TS utils

TypeScript utils

## Format imports

```javascript
import { foo } from "./b";
import { bar } from './a';
import * as b from '../b';
import baz from '../../c';
import { writeFileSync } from 'fs';
```
```javascript
import { writeFileSync } from 'fs';

import baz from '../../c';

import * as b from '../b';

import { bar } from './a';
import { foo } from './b';
```
