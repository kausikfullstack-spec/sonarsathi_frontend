import { Children, isValidElement, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { ChangeEvent, CSSProperties, KeyboardEvent, ReactNode, SelectHTMLAttributes } from 'react'
import { createPortal } from 'react-dom'
import { FiCheck, FiChevronDown } from 'react-icons/fi'
import './select.css'

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'defaultValue' | 'multiple' | 'size'> & {
  value?: string | number
  defaultValue?: string | number
  variant?: 'default' | 'header'
}
interface Option { value: string; label: string; disabled: boolean }

function plainText(children: ReactNode): string {
  return Children.toArray(children).map(child => isValidElement<{ children?: ReactNode }>(child) ? plainText(child.props.children) : String(child)).join('')
}

function readOptions(children: ReactNode, inheritedDisabled = false): Option[] {
  const result: Option[] = []
  Children.forEach(children, child => {
    if (!isValidElement<{ value?: string | number; disabled?: boolean; children?: ReactNode }>(child)) return
    if (child.type === 'option') {
      const label = plainText(child.props.children)
      result.push({ value: String(child.props.value ?? label), label, disabled: Boolean(inheritedDisabled || child.props.disabled) })
    } else result.push(...readOptions(child.props.children, inheritedDisabled || child.props.disabled))
  })
  return result
}

export default function Select({ children, value, defaultValue, onChange, onInvalid, disabled, required, id, name, className = '', variant = 'default', 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, ...nativeProps }: SelectProps) {
  const generatedId = useId()
  const controlId = id ?? `select-${generatedId}`
  const listId = `${controlId}-options`
  const options = readOptions(children)
  const initialValue = String(defaultValue ?? options.find(option => !option.disabled)?.value ?? '')
  const [internalValue, setInternalValue] = useState(initialValue)
  const selectedValue = String(value ?? internalValue)
  const selected = options.find(option => option.value === selectedValue)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [invalid, setInvalid] = useState(false)
  const [position, setPosition] = useState<CSSProperties>({})
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const native = useRef<HTMLSelectElement>(null)
  const popup = useRef<HTMLDivElement>(null)
  const typed = useRef({ text: '', time: 0 })
  const isOpen = open && !disabled

  function show() {
    setPortalHost(trigger.current?.closest('dialog') ?? document.body)
    setOpen(true)
  }

  function openMenu(fromEnd = false) {
    const selectedIndex = options.findIndex(option => option.value === selectedValue && !option.disabled)
    const fallback = fromEnd ? options.findLastIndex(option => !option.disabled) : options.findIndex(option => !option.disabled)
    setActive(selectedIndex >= 0 ? selectedIndex : fallback)
    show()
  }

  function choose(index: number) {
    const option = options[index]
    if (!option || option.disabled || !native.current) return
    native.current.value = option.value
    native.current.dispatchEvent(new Event('change', { bubbles: true }))
    setInvalid(false)
    setOpen(false)
    trigger.current?.focus()
  }

  function changed(event: ChangeEvent<HTMLSelectElement>) {
    setInternalValue(event.target.value)
    setInvalid(false)
    onChange?.(event)
  }

  function keyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Escape' && isOpen) { event.preventDefault(); event.stopPropagation(); setOpen(false); return }
    if (event.key === 'Tab') { setOpen(false); return }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (isOpen) choose(active)
      else openMenu()
      return
    }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault()
      if (!isOpen && ['ArrowDown', 'ArrowUp'].includes(event.key)) { openMenu(event.key === 'ArrowUp'); return }
      const enabled = options.map((option, index) => option.disabled ? -1 : index).filter(index => index >= 0)
      if (!enabled.length) return
      show()
      if (event.key === 'Home') setActive(enabled[0])
      else if (event.key === 'End') setActive(enabled[enabled.length - 1])
      else {
        const current = enabled.indexOf(active)
        setActive(enabled[(current + (event.key === 'ArrowDown' ? 1 : -1) + enabled.length) % enabled.length])
      }
      return
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault()
      const now = Date.now()
      const text = (now - typed.current.time < 700 ? typed.current.text : '') + event.key.toLowerCase()
      typed.current = { text, time: now }
      const repeating = text.length > 1 && new Set(text).size === 1
      const query = repeating ? text[0] : text
      const matching = options.map((_, offset) => (offset + (repeating ? active + 1 : 0)) % options.length).find(index => !options[index].disabled && options[index].label.toLowerCase().startsWith(query)) ?? -1
      if (matching >= 0) { setActive(matching); show() }
    }
  }

  useLayoutEffect(() => {
    if (!isOpen || !trigger.current) return
    function place() {
      const rect = trigger.current!.getBoundingClientRect()
      const width = Math.min(Math.max(rect.width, variant === 'header' ? 220 : 240), window.innerWidth - 24)
      const below = window.innerHeight - rect.bottom - 12
      const above = rect.top - 12
      const flip = below < 220 && above > below
      setPosition({ left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)), width, maxHeight: Math.min(320, Math.max(80, flip ? above - 8 : below - 8)), ...(flip ? { bottom: window.innerHeight - rect.top + 8 } : { top: rect.bottom + 8 }) })
    }
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true) }
  }, [isOpen, variant])

  useLayoutEffect(() => {
    const option = popup.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)
    if (!isOpen || !option || !popup.current) return
    const menu = popup.current
    if (option.offsetTop < menu.scrollTop) menu.scrollTop = option.offsetTop
    else if (option.offsetTop + option.offsetHeight > menu.scrollTop + menu.clientHeight) menu.scrollTop = option.offsetTop + option.offsetHeight - menu.clientHeight
  }, [active, isOpen])

  useEffect(() => {
    if (!isOpen) return
    function outside(event: PointerEvent) {
      const target = event.target as Node
      if (!trigger.current?.contains(target) && !popup.current?.contains(target)) setOpen(false)
    }
    function focusAway(event: FocusEvent) {
      const target = event.target as Node
      if (!trigger.current?.contains(target) && !popup.current?.contains(target)) setOpen(false)
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('focusin', focusAway)
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('focusin', focusAway) }
  }, [isOpen])

  useEffect(() => {
    const form = native.current?.form
    if (!form) return
    function reset() { setInternalValue(initialValue); setInvalid(false); setOpen(false) }
    form.addEventListener('reset', reset)
    return () => form.removeEventListener('reset', reset)
  }, [initialValue])

  return <span className={`sona-select sona-select--${variant}${disabled ? ' is-disabled' : ''} ${className}`}>
    <button ref={trigger} id={controlId} className="sona-select-trigger" type="button" role="combobox" aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} aria-controls={listId} aria-haspopup="listbox" aria-expanded={isOpen} aria-activedescendant={isOpen && active >= 0 ? `${listId}-${active}` : undefined} aria-required={required || undefined} aria-invalid={invalid || undefined} disabled={disabled} onClick={() => isOpen ? setOpen(false) : openMenu()} onKeyDown={keyDown}><span className={!selected?.value ? 'sona-select-placeholder' : undefined}>{selected?.label ?? 'Select an option'}</span><FiChevronDown className={isOpen ? 'is-open' : undefined} aria-hidden="true" /></button>
    <select {...nativeProps} ref={native} id={`${controlId}-native`} name={name} className="sona-select-native" value={selectedValue} onChange={changed} required={required} disabled={disabled} aria-hidden="true" tabIndex={-1} onInvalid={event => { event.preventDefault(); setInvalid(true); trigger.current?.focus(); onInvalid?.(event) }}>{children}</select>
    {invalid && <span className="sona-select-error" role="alert">Please choose an option.</span>}
    {isOpen && portalHost && createPortal(<div ref={popup} className="sona-select-menu" id={listId} role="listbox" aria-label={ariaLabel ?? 'Options'} style={position}>{options.map((option, index) => <div id={`${listId}-${index}`} role="option" key={`${option.value}-${index}`} data-index={index} aria-selected={option.value === selectedValue} aria-disabled={option.disabled || undefined} className={`sona-select-option${active === index ? ' is-highlighted' : ''}`} onPointerDown={event => event.preventDefault()} onPointerMove={() => { if (!option.disabled) setActive(index) }} onClick={() => choose(index)}><span>{option.label}</span>{option.value === selectedValue && <FiCheck aria-hidden="true" />}</div>)}</div>, portalHost)}
  </span>
}
