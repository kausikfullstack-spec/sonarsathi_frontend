import $ from 'jquery'

/**
 * Local jQuery hover-magnifier plugin. It owns only its lens and namespaced
 * listeners, so React can safely change gallery images and unmount the view.
 */
$.fn.sonaMagnify = function (options = {}) {
  return this.each(function () {
    const element = this
    $.data(element, 'sonaMagnify')?.destroy()
    if (options === 'destroy') return

    const settings = { zoom: 2.5, viewScale: 1, lensSize: 180, ...options }
    const $element = $(element)
    const image = element.querySelector('img')
    if (!image) return
    const media = window.matchMedia('(hover: hover) and (pointer: fine)')
    const lens = document.createElement('div')
    lens.className = 'product-magnifier-lens'
    lens.setAttribute('aria-hidden', 'true')
    element.append(lens)
    let frame = 0
    let point = null
    let active = false

    function hide() {
      active = false
      point = null
      cancelAnimationFrame(frame)
      frame = 0
      $element.removeClass('is-magnifying')
    }

    function draw() {
      frame = 0
      if (!active || !point || !image.complete || !image.naturalWidth) return
      const bounds = element.getBoundingClientRect()
      const x = point.x - bounds.left
      const y = point.y - bounds.top
      const ratio = image.naturalWidth / image.naturalHeight
      const width = Math.min(bounds.width, bounds.height * ratio) * settings.viewScale
      const height = Math.min(bounds.height, bounds.width / ratio) * settings.viewScale
      const offsetX = (bounds.width - width) / 2
      const offsetY = (bounds.height - height) / 2
      if (x < Math.max(0, offsetX) || y < Math.max(0, offsetY) || x > Math.min(bounds.width, offsetX + width) || y > Math.min(bounds.height, offsetY + height)) {
        $element.removeClass('is-magnifying')
        return
      }
      const size = Math.min(settings.lensSize, bounds.width * .42)
      Object.assign(lens.style, {
        width: `${size}px`, height: `${size}px`,
        left: `${x - size / 2}px`, top: `${y - size / 2}px`,
        backgroundImage: `url("${image.currentSrc || image.src}")`,
        backgroundSize: `${width * settings.zoom}px ${height * settings.zoom}px`,
        backgroundPosition: `${size / 2 - (x - offsetX) * settings.zoom}px ${size / 2 - (y - offsetY) * settings.zoom}px`,
      })
      $element.addClass('is-magnifying')
    }

    function move(event) {
      if (!media.matches || event.originalEvent?.pointerType === 'touch') return
      active = true
      point = { x: event.clientX, y: event.clientY }
      if (!frame) frame = requestAnimationFrame(draw)
    }

    $element.on('pointerenter.sonaMagnify pointermove.sonaMagnify', move)
    $element.on('pointerleave.sonaMagnify pointercancel.sonaMagnify', hide)
    $(window).on('scroll.sonaMagnify-' + element.dataset.galleryId, hide)
    media.addEventListener('change', hide)
    const resize = new ResizeObserver(hide)
    resize.observe(element)

    $.data(element, 'sonaMagnify', {
      destroy() {
        hide()
        $element.off('.sonaMagnify')
        $(window).off('scroll.sonaMagnify-' + element.dataset.galleryId, hide)
        media.removeEventListener('change', hide)
        resize.disconnect()
        lens.remove()
        $.removeData(element, 'sonaMagnify')
      },
    })
  })
}

export function mountProductMagnifier(element, options) {
  $(element).sonaMagnify(options)
  return () => { $(element).sonaMagnify('destroy') }
}
