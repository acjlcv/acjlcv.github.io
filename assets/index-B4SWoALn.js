import{u as k,j as e,L as g,a as l,M as p,r as m,b as c,c as h,d as u,R as v,e as d,N as x,f as _,g as I,H as N}from"./vendor-nMe-4TIH.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function r(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(i){if(i.ep)return;i.ep=!0;const a=r(i);fetch(i.href,a)}})();const $=[{href:"/",label:"home"},{href:"/projects",label:"projects"},{href:"/misc",label:"misc"}];function T(){const n=k().hash.replace("#","")||"/home";return e.jsx("nav",{className:"sidebar",children:e.jsx("ul",{className:"nav-links",children:$.map(r=>e.jsx("li",{children:e.jsx(g,{to:r.href,className:n===r.href.replace("/#","")?"active":"",children:r.label})},r.label))})})}const z=[{href:"https://linkedin.com/in/arnold-cai",label:"linkedin"},{href:"https://github.com/acjlcv",label:"github"},{href:"https://x.com/arncai",label:"x"}];function A(){return e.jsx("footer",{className:"footer",children:e.jsx("ul",{className:"social-links",children:z.map(t=>e.jsx("li",{children:e.jsx("a",{href:t.href,target:"_blank",rel:"noopener noreferrer",children:t.label})},t.label))})})}function S({children:t}){return e.jsx("div",{className:"layout-container",children:e.jsxs("div",{className:"content-wrapper",children:[e.jsx(T,{}),e.jsx("main",{className:"main",children:e.jsxs("div",{className:"content-area",children:[t,e.jsx(A,{})]})})]})})}function H(){return e.jsxs("div",{className:"content",children:[e.jsx("header",{className:"mb-4",children:e.jsx("h1",{children:"Arnold Cai"})}),e.jsx("p",{children:"arnoldcai [at] berkeley [dot] edu"}),e.jsxs("div",{className:"mb-4",children:[e.jsx("p",{className:"m-0",children:"UC Berkeley computer science graduate. Looking for new grad and/or entry-level swe, mle, ds positions."}),e.jsx("p",{className:"m-0",children:"Currently learning opencode, nvim, fullstack and langchain/graph."})]}),e.jsx("hr",{}),e.jsxs("div",{className:"grid grid-cols-[1fr_auto] text-sm mb-4",children:[e.jsx("div",{children:e.jsxs("ul",{className:"space-y-1",children:[e.jsxs("li",{children:[e.jsx("span",{className:"inline-block w-2 h-2 rounded-full mr-2"}),"Tsinghua University"]}),e.jsxs("li",{children:[e.jsx("span",{className:"inline-block w-2 h-2 rounded-full mr-2"}),"Berkeley Brothers"]}),e.jsxs("li",{children:[e.jsx("span",{className:"inline-block w-2 h-2 rounded-full mr-2"}),"IBM Accelerate"]}),e.jsxs("li",{children:[e.jsx("span",{className:"inline-block w-2 h-2 rounded-full mr-2"}),"ezML"]}),e.jsxs("li",{children:[e.jsx("span",{className:"inline-block w-2 h-2 rounded-full mr-2"}),"UC Berkeley"]})]})}),e.jsx("div",{className:"text-right text-[#666]",children:e.jsxs("ul",{className:"font-mono",children:[e.jsx("li",{children:"2025"}),e.jsx("li",{children:"2024"}),e.jsx("li",{children:"2024"}),e.jsx("li",{children:"2024"}),e.jsx("li",{children:"2023"})]})})]}),e.jsx("hr",{}),e.jsx("p",{className:"thanks",children:"thanks for the inspiration mr. alex"})]})}const P=`---
title: First Post
date: 2026.3.19
---

Just finished coding this up website using react + vite. Had some help with opencode and their free models. Needless to say, opencode did a great job with generating boilerplate and figure out how to do easy tasks from pure English. However some of the logic/reasoning based tasks still failed, especially when the context window got too large or if the prompt got to diverse in terms of what tasks need to be done (this can probably be done in maybe multi-agent coding, where the head honcho dissects the description and plans/splits into multiple smaller task that are then assigned to subagents to focus on and code).


I look forward to writing my next post about the advantages and limitations of ai-assited coding.


Stay tuned.`,L=`---
title: Diffusion Model Fun
date: 2024.11.18
---

# Diffusion Model Applications

Diffusion model shenanigans. Using [DeepFloyd IF](https://huggingface.co/docs/diffusers/api/pipelines/deepfloyd_if) diffusion model trained by Stablility AI. This model takes in \`64x64\` images and produces \`64x64\` images from its first stage. I did not upsample the images into \`256x256\` images using the second stage of the model due to lack of google colab credits :(. The first part will be going through the implementation of a diffusion model and its steps while the second part will be implementing some cool results from some fairly recent papers.

## 0.1 Seed + Setup
I used \`SEED=501\`.

Here some of the ouput images after passing it through stage 1 and 2 UNets of the model. It appears that the number of iterative steps the model takes affects the output image pretty drastically even though the same word embedding was used.

<center>

<img src="/images/proj5/model-10-steps.png" width=640>
<p>10 steps</p>

<img src="/images/proj5/model-20-steps.png" width=640>
<p>20 steps</p>

<img src="/images/proj5/model-40-steps.png" width=640>
<p>40 steps</p>

</center>


## 1.1 Forward Function
We need to implement a function that adds noise to an image. This is achieved with this formula:

$$
x_t = \\sqrt{\\bar{\\alpha}_t}x_0 + \\sqrt{1 - \\bar\\alpha_t}\\epsilon, \\space where \\space \\epsilon \\sim N(0, 1)
$$

We are using a noise generator (or estimation) using a standard normal distirbution $\\epsilon$, which can be calculated via \`torch.randn_like\`, and an \`alpha_cumprod\` $\\bar\\alpha_t$ of $t$ step. As $t$ increases, so does the amount of noise added to the image increase.

<center>
    <table>
        <tbody align=center>
            <tr>
                <td>
                    <img src="/images/proj5/campanile.jpg" width=128>
                    <p align=center>campanile.jpg</p>
                </td>
                <td>
                    <img src="/images/proj5/campanile-noisy-250.jpg" width=128>
                    <p align=center>t=250</p>
                </td>
                <td>
                    <img src="/images/proj5/campanile-noisy-500.jpg" width=128>
                    <p align=center>t=500</p>
                </td>
                <td>
                    <img src="/images/proj5/campanile-noisy-750.jpg" width=128>
                    <p align=center>t=750</p>
                </td>
            </tr>
        </tbody>
    </table>
</center>

## 1.2 Classical Denoising
After noise-ifying images, we can train a diffusion model to estimate denosising processes of these noisified image. That way the diffusion model can later "generate" images by converting random noisy images not on the real image manifold into images related to the input fed into the model.

We will first try to implement a classical denoising method via Gaussian Blur Filtering. In particular, I used \`torchvision.trnasforms.functional.gaussian_blur\` with a kernel size of \`(7, 7)\` to implement the blurs on the noisy images. This will pass the noisy image through a low pass filter and therefore get rid of some of the low frequency noise. However, as seen by the results, the Gaussian Blur Filter doesn't get rid of all the noise and it also blurs the original image.

<center>
    <table>
        <tr>
            <td>
                <img src="/images/proj5/campanile-noisy-250.jpg" width=128>
                <p align=center>t=250</p>
            </td>
            <td>
                <img src="/images/proj5/campanile-noisy-500.jpg" width=128>
                <p align=center>t=500</p>
            </td>
            <td>
                <img src="/images/proj5/campanile-noisy-750.jpg" width=128>
                <p align=center>t=750</p>
            </td>
        </tr>
    </table>
</center>

<center>
<table>
    <tr>
        <td>
            <img src="/images/proj5/campanile-gaussian-denoised-250.jpg" width=128>
            <p align=center>blur t=250</p>
        </td>
        <td>
            <img src="/images/proj5/campanile-gaussian-denoised-500.jpg" width=128>
            <p align=center>blur t=500</p>
        </td>
        <td>
            <img src="/images/proj5/campanile-gaussian-denoised-750.jpg" width=128>
            <p align=center>blur t=750</p>
        </td>
    </tr>
</table>
</center>

## 1.3 One Step Denoising
We can further improve the denoising by using a pretrained diffusion model to estimate the noise in the new noisy image and then remove that estiamted noise from that same noisy image to get closer towards the original image. Since DeepFloyd was trained on text conditioning, we use the first stage UNet on the condition of \`"a high quality photo"\`.

In comparison to the Gaussian Blur Filter, this method of denoising gets rid of all the noise. However, the predicted image still tends to be blurred and loeses some of the structure and detailes that were in the original image.

<center>
<table>
    <tr>
        <td>
            <img src="/images/proj5/campanile-noisy-250.jpg" width=128>
            <p align=center>t=250</p>
        </td>
        <td>
            <img src="/images/proj5/campanile-noisy-500.jpg" width=128>
            <p align=center>t=500</p>
        </td>
        <td>
            <img src="/images/proj5/campanile-noisy-750.jpg" width=128>
            <p align=center>t=750</p>
        </td>
    </tr>
</table>
</center>

<center>
<table>
    <tr>
        <td>
            <img src="/images/proj5/campanile-unet-denoised-250.jpg" width=128>
            <p align=center>one-step t=250</p>
        </td>
        <td>
            <img src="/images/proj5/campanile-unet-denoised-500.jpg" width=128>
            <p align=center>one-step t=500</p>
        </td>
        <td>
            <img src="/images/proj5/campanile-unet-denoised-750.jpg" width=128>
            <p align=center>one-step t=750</p>
        </td>
    </tr>
</table>
</center>

## 1.4 Iterative Denoising

Another method of denoising we can use is iterative denoising, the default denoising method used by diffusion models. It would be tedious and expensive to go through each step, espcially if $T$ is very large. Therefore, we iterate through some \`strided_timesteps\` with \`strides=30\`. The formula is given below with $t$ being the current timestep and $t'$ being an earlier timestep such that $t' < t$.

$$
x_{t'} = \\frac{\\sqrt{\\bar\\alpha_{t'}}\\beta_t}{1 - \\bar\\alpha_t} x_0 +
        \\frac{\\sqrt{\\alpha_t}(1 - \\bar\\alpha_{t'})}{1 - \\bar\\alpha_t} x_t +
        v_\\sigma
$$

$$
\\alpha_t = \\frac{\\bar\\alpha_t}{\\bar\\alpha_{t'}}
$$

$$
\\beta_t = 1 - \\alpha_t
$$

$x_0$ is the estimated clean image at each iterative step using the formula used in the forward process with noise $\\epsilon$ being the estimated noise from UNet output.

<center>
<table>
    <tr>
        <td>
            <img src="/images/proj5/campanile-iterative-t-90.jpg" width=128>
            <p align=center>t=90</p>
        </td>
        <td>
            <img src="/images/proj5/campanile-iterative-t-240.jpg" width=128>
            <p align=center>t=240</p>
        </td>
        <td>
            <img src="/images/proj5/campanile-iterative-t-390.jpg" width=128>
            <p align=center>t=390</p>
        </td>
        <td>
            <img src="/images/proj5/campanile-iterative-t-540.jpg" width=128>
            <p align=center>t=540</p>
        </td>
        <td>
            <img src="/images/proj5/campanile-iterative-t-690.jpg" width=128>
            <p align=center>t=690</p>
        </td>
    </tr>
</table>
</center>

<center>
<table>
    <tr>
        <td>
            <img src="/images/proj5/campanile.jpg" width=128>
            <p align=center>campanile.jpg</p>
        </td>
        <td>
            <img src="/images/proj5/campanile-iterative-denoised.jpg" width=128>
            <p align=center>iterative</p>
        </td>
        <td>
            <img src="/images/proj5/campanile-clean_one_step.jpg" width=128>
            <p align=center>one-step</p>
        </td>
        <td>
            <img src="/images/proj5/campanile-blur-filtered.jpg" width=128>
            <p align=center>gaussian blur</p>
        </td>
    </tr>
</table>
</center>

## 1.5 Diffusion Model Sampling
We are going to generate images from scratch by starting the iterative denoising at $T$ timestep (the max timestep) and feeding the model a random noisy image generated via \`torch.rand_like\` and with the word embedding \`"a high quailty photo"\`. Here are some samples I genereated using iterative denoising.

<center>
<table>
    <tr>
        <td>
            <img src="/images/proj5/random-sample-0.jpg" width=128>
        </td>
        <td>
            <img src="/images/proj5/random-sample-1.jpg" width=128>
        </td>
        <td>
            <img src="/images/proj5/random-sample-2.jpg" width=128>
        </td>
        <td>
            <img src="/images/proj5/random-sample-3.jpg" width=128>
        </td>
        <td>
            <img src="/images/proj5/random-sample-4.jpg" width=128>
        </td>
    </tr>
</table>
</center>

## 1.6 Classifier Free Guidance (CFG)
Some of the images generated by iterative denoising seem really random or confusing. To fix this, we will use [Classifier Free Guidance](https://arxiv.org/abs/2207.12598), which uses an conditional and unconditional noise estimate the new noise.

$$\\epsilon = \\epsilon_u + \\gamma(\\epsilon_c - \\epsilon_u)$$

For these images, I used \`"a high quality photo"\` for the UNet embedding that would estimate conditional noise and a null prompt of \`""\` as the unconditional noise. Furthermore, I used $\\gamma=7$ when calculating the overall noise estimate.

<center>
<table>
    <tr>
        <td>
            <img src="/images/proj5/cfg-random-sample-0.jpg" width=128>
        </td>
        <td>
            <img src="/images/proj5/cfg-random-sample-1.jpg" width=128>
        </td>
        <td>
            <img src="/images/proj5/cfg-random-sample-2.jpg" width=128>
        </td>
        <td>
            <img src="/images/proj5/cfg-random-sample-3.jpg" width=128>
        </td>
        <td>
            <img src="/images/proj5/cfg-random-sample-4.jpg" width=128>
        </td>
    </tr>
</table>
</center>

## 1.7 Image to Image Translation
Instead of passing in a randomly generated image, we will pass in a noise-ified image (using \`forward(img, t)\`) of the original image at different timesteps in order to get the diffusion model to output something similar to the original image we noise-ified.

> **Side Note:** I used a \`strided_timesteps\` array that ranged from \`[990, 0]\` with a \`stride=30\`. When \`i_start=0\`, \`t=990\`, which the timestep at which \`forward(img, t)\` would return the noisiest version of the original image.

### campanile.jpg
<center>
<table>
    <tr>
        <td>
            <img src="/images/proj5/translate-campanile-1.jpg" width=128>
            <p align=center>i_start=0</p>
        </td>
        <td>
            <img src="/images/proj5/translate-campanile-3.jpg" width=128>
            <p align=center>i_start=3</p>
        </td>
        <td>
            <img src="/images/proj5/translate-campanile-5.jpg" width=128>
            <p align=center>i_start=5</p>
        </td>
        <td>
            <img src="/images/proj5/translate-campanile-7.jpg" width=128>
            <p align=center>i_start=7</p>
        </td>
        <td>
            <img src="/images/proj5/translate-campanile-10.jpg" width=128>
            <p align=center>i_start=10</p>
        </td>
        <td>
            <img src="/images/proj5/translate-campanile-20.jpg" width=128>
            <p align=center>i_start=20</p>
        </td>
    </tr>
</table>
</center>

### nyc.jpg
<center>
<table>
    <tr>
        <td>
            <img src="/images/proj5/translate-nyc-1.jpg" width=128>
            <p align=center>i_start=0</p>
        </td>
        <td>
            <img src="/images/proj5/translate-nyc-3.jpg" width=128>
            <p align=center>i_start=3</p>
        </td>
        <td>
            <img src="/images/proj5/translate-nyc-5.jpg" width=128>
            <p align=center>i_start=5</p>
        </td>
        <td>
            <img src="/images/proj5/translate-nyc-7.jpg" width=128>
            <p align=center>i_start=7</p>
        </td>
        <td>
            <img src="/images/proj5/translate-nyc-10.jpg" width=128>
            <p align=center>i_start=10</p>
        </td>
        <td>
            <img src="/images/proj5/translate-nyc-20.jpg" width=128>
            <p align=center>i_start=20</p>
        </td>
    </tr>
</table>
</center>

### sf.jpg
<center>
<table>
    <tr>
        <td>
            <img src="/images/proj5/translate-sf-1.jpg" width=128>
            <p align=center>i_start=0</p>
        </td>
        <td>
            <img src="/images/proj5/translate-sf-3.jpg" width=128>
            <p align=center>i_start=3</p>
        </td>
        <td>
            <img src="/images/proj5/translate-sf-5.jpg" width=128>
            <p align=center>i_start=5</p>
        </td>
        <td>
            <img src="/images/proj5/translate-sf-7.jpg" width=128>
            <p align=center>i_start=7</p>
        </td>
        <td>
            <img src="/images/proj5/translate-sf-10.jpg" width=128>
            <p align=center>i_start=10</p>
        </td>
        <td>
            <img src="/images/proj5/translate-sf-20.jpg" width=128>
            <p align=center>i_start=20</p>
        </td>
    </tr>
</table>
</center>

## 1.7.1 Hand Drawn and Web Images
Let's see if CFG with DeepFloyd runs well on hand drawn images and images taken from the web!

### web: jinx.jpg
<center>
<table>
    <tr>
        <td>
            <img src="/images/proj5/cfg-web-1.jpg" width=128>
            <p align=center>i_start=0</p>
        </td>
        <td>
            <img src="/images/proj5/cfg-web-3.jpg" width=128>
            <p align=center>i_start=3</p>
        </td>
        <td>
            <img src="/images/proj5/cfg-web-5.jpg" width=128>
            <p align=center>i_start=5</p>
        </td>
        <td>
            <img src="/images/proj5/cfg-web-7.jpg" width=128>
            <p align=center>i_start=7</p>
        </td>
        <td>
            <img src="/images/proj5/cfg-web-10.jpg" width=128>
            <p align=center>i_start=10</p>
        </td>
        <td>
            <img src="/images/proj5/cfg-web-20.jpg" width=128>
            <p align=center>i_start=20</p>
        </td>
        <td>
            <img src="/images/proj5/jinx.jpg" width=128>
            <p align=center>jinx.jpg</p>
        </td>
    </tr>
</table>
</center>

### hand drawn: pikachu?
<center>
<table>
    <tr>
        <td>
            <img src="/images/proj5/hand-drawn-pikachu-1.jpg" width=128>
            <p align=center>i_start=0</p>
        </td>
        <td>
            <img src="/images/proj5/hand-drawn-pikachu-3.jpg" width=128>
            <p align=center>i_start=3</p>
        </td>
        <td>
            <img src="/images/proj5/hand-drawn-pikachu-5.jpg" width=128>
            <p align=center>i_start=5</p>
        </td>
        <td>
            <img src="/images/proj5/hand-drawn-pikachu-7.jpg" width=128>
            <p align=center>i_start=7</p>
        </td>
        <td>
            <img src="/images/proj5/hand-drawn-pikachu-10.jpg" width=128>
            <p align=center>i_start=10</p>
        </td>
        <td>
            <img src="/images/proj5/hand-drawn-pikachu-20.jpg" width=128>
            <p align=center>i_start=20</p>
        </td>
                <td>
            <img src="/images/proj5/pikachu.jpg" width=128>
            <p align=center>pikachu.jpg</p>
        </td>
    </tr>
</table>
</center>

### hand drawn: ditto?
<center>
<table>
    <tr>
        <td>
            <img src="/images/proj5/hand-drawn-ditto-1.jpg" width=128>
            <p align=center>i_start=0</p>
        </td>
        <td>
            <img src="/images/proj5/hand-drawn-ditto-3.jpg" width=128>
            <p align=center>i_start=3</p>
        </td>
        <td>
            <img src="/images/proj5/hand-drawn-ditto-5.jpg" width=128>
            <p align=center>i_start=5</p>
        </td>
        <td>
            <img src="/images/proj5/hand-drawn-ditto-7.jpg" width=128>
            <p align=center>i_start=7</p>
        </td>
        <td>
            <img src="/images/proj5/hand-drawn-ditto-10.jpg" width=128>
            <p align=center>i_start=10</p>
        </td>
        <td>
            <img src="/images/proj5/hand-drawn-ditto-20.jpg" width=128>
            <p align=center>i_start=20</p>
        </td>
        <td>
            <img src="/images/proj5/ditto.jpg" width=128>
            <p align=center>ditto.jpg</p>
        </td>
    </tr>
</table>
</center>

## 1.7.2 Inpainting
We can use a mask and only pass in the mask portion through the forwarding process such that the diffusion model will only generate within the masked area.

$$
x_t = \\textbf{m} x_t + (1 - \\textbf{m})\\text{forward}(x_{orig}, t)
$$

### campanile.jpg
<center>
<table>
    <tr>
        <td>
            <img src="/images/proj5/campanile.jpg" width=128>
            <p align=center>campanile.jpg</p>
        </td>
        <td>
            <img src="/images/proj5/mask-campanile.jpg" width=128>
            <p align=center>mask</p>
        </td>
                <td>
            <img src="/images/proj5/replace-campanile.jpg" width=128>
            <p align=center>to replace</p>
        </td>
        <td>
            <img src="/images/proj5/inpainting-campanile.jpg" width=128>
            <p align=center>inpainted</p>
        </td>
    </tr>
</table>
</center>

### nyc
<center>
<table>
    <tr>
        <td>
            <img src="/images/proj5/nyc.jpg" width=128>
            <p align=center>nyc.jpg</p>
        </td>
        <td>
            <img src="/images/proj5/mask-nyc.jpg" width=128>
            <p align=center>mask</p>
        </td>
                <td>
            <img src="/images/proj5/replace-nyc.jpg" width=128>
            <p align=center>to replace</p>
        </td>
        <td>
            <img src="/images/proj5/inpainting-nyc.jpg" width=128>
            <p align=center>inpainted</p>
        </td>
    </tr>
</table>
</center>

### sh
<center>
<table>
    <tr>
        <td>
            <img src="/images/proj5/sh.jpeg" width=128>
            <p align=center>sh.jpg</p>
        </td>
        <td>
            <img src="/images/proj5/mask-sh.jpg" width=128>
            <p align=center>mask</p>
        </td>
                <td>
            <img src="/images/proj5/replace-sh.jpg" width=128>
            <p align=center>to replace</p>
        </td>
        <td>
            <img src="/images/proj5/inpainting-sh.jpg" width=128>
            <p align=center>inpainted</p>
        </td>
    </tr>
</table>
</center>

## 1.7.3 Text Conditional Image to Image Translation
We are going to run the image translation again, but we'll replace the generic embedding \`"a high quality photo"\` into a specific prompt. The generated models will look more like either the prompt or the original image passed into the model depending on how noisy the initial forwarding process is.

### \`"a rocket ship"\` $\\longrightarrow$ campanile.jpg
<center>
<table>
    <tr>
        <td>
            <img src="/images/proj5/text-translate-campanile-1.jpg" width=128>
            <p align=center>i_start=0</p>
        </td>
        <td>
            <img src="/images/proj5/text-translate-campanile-3.jpg" width=128>
            <p align=center>i_start=3</p>
        </td>
        <td>
            <img src="/images/proj5/text-translate-campanile-5.jpg" width=128>
            <p align=center>i_start=5</p>
        </td>
        <td>
            <img src="/images/proj5/text-translate-campanile-7.jpg" width=128>
            <p align=center>i_start=7</p>
        </td>
        <td>
            <img src="/images/proj5/text-translate-campanile-10.jpg" width=128>
            <p align=center>i_start=10</p>
        </td>
        <td>
            <img src="/images/proj5/text-translate-campanile-20.jpg" width=128>
            <p align=center>i_start=20</p>
        </td>
        <td>
            <img src="/images/proj5/campanile.jpg" width=128>
            <p align=center>campanile.jpg</p>
        </td>
    </tr>
</table>
</center>

### \`"a lithograph of waterfalls"\` $\\longrightarrow$ nyc.jpg
<center>
<table>
    <tr>
        <td>
            <img src="/images/proj5/text-translate-nyc-1.jpg" width=128>
            <p align=center>i_start=0</p>
        </td>
        <td>
            <img src="/images/proj5/text-translate-nyc-3.jpg" width=128>
            <p align=center>i_start=3</p>
        </td>
        <td>
            <img src="/images/proj5/text-translate-nyc-5.jpg" width=128>
            <p align=center>i_start=5</p>
        </td>
        <td>
            <img src="/images/proj5/text-translate-nyc-7.jpg" width=128>
            <p align=center>i_start=7</p>
        </td>
        <td>
            <img src="/images/proj5/text-translate-nyc-10.jpg" width=128>
            <p align=center>i_start=10</p>
        </td>
        <td>
            <img src="/images/proj5/text-translate-nyc-20.jpg" width=128>
            <p align=center>i_start=20</p>
        </td>
        <td>
            <img src="/images/proj5/nyc.jpg" width=128>
            <p align=center>nyc.jpg</p>
        </td>
    </tr>
</table>
</center>

### \`"an oil painting of a snowy mountain village"\` $\\longrightarrow$ sf.jpg
<center>
<table>
    <tr>
        <td>
            <img src="/images/proj5/text-translate-sf-1.jpg" width=128>
            <p align=center>i_start=0</p>
        </td>
        <td>
            <img src="/images/proj5/text-translate-sf-3.jpg" width=128>
            <p align=center>i_start=3</p>
        </td>
        <td>
            <img src="/images/proj5/text-translate-sf-5.jpg" width=128>
            <p align=center>i_start=5</p>
        </td>
        <td>
            <img src="/images/proj5/text-translate-sf-7.jpg" width=128>
            <p align=center>i_start=7</p>
        </td>
        <td>
            <img src="/images/proj5/text-translate-sf-10.jpg" width=128>
            <p align=center>i_start=10</p>
        </td>
        <td>
            <img src="/images/proj5/text-translate-sf-20.jpg" width=128>
            <p align=center>i_start=20</p>
        </td>
        <td>
            <img src="/images/proj5/sf.jpg" width=128>
            <p align=center>sf.jpg</p>
        </td>
    </tr>
</table>
</center>

## 1.8 Visual Anagrams
We can create optical illusions with diffusion models by using the [Visual Anagrams](https://dangeng.github.io/visual_anagrams/) algorithm presented by this paper. Basically, we take two images and generate their CFG noise and then combine the noise two noises. However, one of the images must be flipped and then flipped again to generate an optical illusion that can be seen when the image is flipped. For this project, I just flipped along the x-axis (index 2 of the tensor) using \`torch.flip\`.

$$
\\epsilon_1 = \\text{UNet}(x_t, t, p_1)
$$

$$
\\epsilon_2 = \\text{flip}(\\text{UNet}(\\text{flip}(x_t), t, p_2))
$$

$$
\\epsilon = (\\epsilon_1 + \\epsilon_2) / 2
$$

Here are some examples:

<center>
<table>
    <tr>
        <td>
            <img src="/images/proj5/visual-anagram-oldman.jpg" width=128>
            <p align=center>old man</p>
        </td>
        <td>
            <img src="/images/proj5/visual-anagram-campfire.jpg" width=128>
            <p align=center>campfire</p>
        </td>
    </tr>
</table>
</center>

<center>
<table>
    <tr>
        <td>
            <img src="/images/proj5/visual-anagram-rocket.jpg" width=128>
            <p align=center>rocket ship</p>
        </td>
        <td>
            <img src="/images/proj5/visual-anagram-snow.jpg" width=128>
            <p align=center>snowy mountain village</p>
        </td>
    </tr>
</table>
</center>

<center>
<table>
    <tr>
        <td>
            <img src="/images/proj5/visual-anagram-dog.jpg" width=128>
            <p align=center>dog</p>
        </td>
        <td>
            <img src="/images/proj5/visual-anagram-waterfalls.jpg" width=128>
            <p align=center>waterfall</p>
        </td>
    </tr>
</table>
</center>

## 1.9 Hybrid Images
We can also create hybrid images by calculating the CFG noise of the two images and then combining the low frequency of one image with the high frequency of another image as demonstrated with this paper on [Factorized Diffusion](https://arxiv.org/abs/2404.11615).

$$
\\epsilon_1 = \\text{UNet}(x_t, t, p_1)
$$

$$
\\epsilon_2 = \\text{UNet}(x_t, t, p_2)
$$

$$
\\epsilon = f_\\text{lowpass}(\\epsilon_1) + f_\\text{highpass}(\\epsilon_2)
$$

Here are some examples:
<center>
<table>
    <tr>
        <td>
            <img src="/images/proj5/hybrid-skull-waterfall.jpg" width=128>
            <p align=center>skull + waterfall</p>
        </td>
        <td>
            <img src="/images/proj5/hybrid-yin-yang-flowers.jpg" width=128>
            <p align=center>yin and yang + flowers</p>
        </td>
        <td>
            <img src="/images/proj5/hybrid-panda-sunset.jpg" width=128>
            <p align=center>panda + sunset</p>
        </td>
    </tr>
</table>
</center>

### reflection
I really enjoyed this project as it was my first time using a diffusion model. It was fun creating hybrid and anagram images. I learned a lot about how diffusion models work and hopefully I could do a deeper dive into diffusion models with next part.

# Diffusion Model From Scratch

## Part 1: Unconditional UNet
Modern diffusion models uses UNet architecture. Below is how the UNet architecture is structured.

<center>

<img src="/images/proj5/unconditional_arch.png" width=640>

</center>

I used the Unconditional UNet to train a denoiser on the MNIST dataset with \`batch_size=256\` over 5 epochs. The UNet had \`D=128\` hidden layers and we optimized the MSE loss function using the ADAM optimizer with a learning rate of \`1e-4\`. Furthermore, I trained a denoiser with  \`sigma=0.50\` applied to the images.

Here's the training loss log-scaled graph.

<center>

<img src="/images/proj5/uncond-training-loss.jpg" width=640>

</center>

And here are some sample outputs of the model after the first and fifth epoch.

<center>

<h3>After Epoch 1</h3>
<img src="/images/proj5/uncond-e0.jpg" width=640>

<h3>After Epoch 5</h3>
<img src="/images/proj5/uncond-e4.jpg" width=640>

</center>

Let's also see how well a \`sigma=0.5\` trained denoiser would work on other $\\sigma$ noisy images.

<center>

<img src="/images/proj5/uncond-out-of-distribution.jpg" width=640>

</center>

The results are okay, but it can definitely look much better, especially when the input image has a lot of noise added to it.

## Part 2: Time-Conditioned UNet
In order to create a time conditioned UNet, we have to add some fully connected blocks to the unconditional UNet such that we can use timesteps affect some stages of the UNet to produce a time-conditioned result.

Here's the Time Conditioned UNet structure.
<center>

<img src="/images/proj5/conditional_arch.png" width=640>

</center>

I used the Time-Conditioned UNet to train a noise estimator on the MNIST dataset with \`batch_size=128\` over 20 epochs. The UNet had \`D=64\` hidden layers and we optimized the MSE loss function using the ADAM optimizer with an initial learning rate of \`1e-3\` which would then decrease after each epoch.

Here's the training loss log-scaled graph.

<center>

<img src="/images/proj5/time-cond-training-loss.jpg" width=640>

</center>

And here are some sample outputs by running the model on random noise after the fifth and twentieth epoch.

<center>

<h3>After Epoch 5</h3>
<img src="/images/proj5/time-cond-sample-epoch-4.jpg" width=640>

<h3>After Epoch 20</h3>
<img src="/images/proj5/time-cond-sample-epoch-19.jpg" width=640>

</center>

The generation of the hand-written numbers of random numbers is not bad looking, but definitely could look better. Furthermore, the numbers are generated in a random order based on the time step. We can imporve these results by using a Class-Conditioned UNet.

## Part 3: Class Conditioned UNet
This time, instead of only passing in a timestep scalar into the FCBlocks, we will also be passing in some class labels into the FCBlocks. The resulting block from inputting class labels would then be multipliled element wise into the affected block (i.e. Unflatten) rather than added to it like the timestep parameter. This is to ensure that only a particular class label can generate a certain result. Also, another thing to note is that we have to pass an One Hot Encoding of each class label into the FCBlock because we are technically plugging in categorical data into the Neural Network which needs to be interpreted as numbers.

Here's the Class Conditioned UNet structure.
<center>

<img src="/images/proj5/conditional_arch.png" width=640>

</center>

I used the Class-Conditioned UNet to train a noise estimator on the MNIST dataset with \`batch_size=128\` over 20 epochs. The UNet had \`D=64\` hidden layers and we optimized the MSE loss function using the ADAM optimizer with an initial learning rate of \`1e-3\` which would then decrease after each epoch. The only difference this time is that I will also be passing in the training labels of each image along with the timestep parameter into the model.

Here are some sample outputs by running the model on random noise after the fifth and twentieth epoch.

<center>

<h3>After Epoch 5</h3>
<img src="/images/proj5/class-cond-sample-epoch-4.jpg" width=640>

<h3>After Epoch 20</h3>
<img src="/images/proj5/class-cond-sample-epoch-19.jpg" width=640>

</center>

We can see that by the 5th epoch, the results generated from random noise is already looking much better than the results generated by the Time-Conditioned UNet by the 20th epoch.

## reflection
This project was pretty fun as it was one of my first hands on experience with pytorch model training. I learned a lot how Nerual Networks worked and in particular the UNet structure and diffusion models.`,M=`---
title: It's Morphin' Time (Face Morphing)
date: 2024.10.7
---

In this project, I will be morphing one face to another and also do some experimentation with population mean faces.

## task 1: defining correspondences
For the first morph, I decided to morph George Clooney's face to Mark Zuckerberg's face and vice versa. Photos are from [Martin Schoeller's portfolio](https://martinschoeller.com).

I created a triangular mask for each photo using [Delaunay triangulation](https://en.wikipedia.org/wiki/Delaunay_triangulation). Both photos contain the same triangular structure as each other, so translating corresponding keypoints and triangluar regions is easier.

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj3/clooney.jpg" width=128>
            <p align="middle">george clooney</p>
        </td>
        <td>
            <img src="/images/proj3/clooney-keypoints.jpg" width=128>
            <p align="middle">george clooney with keypoints mask</p>
        </td>
    </tr>
</table>
</div>

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj3/zuck.jpg" width=128>
            <p align="middle">mark zuckerberg</p>
        </td>
        <td>
            <img src="/images/proj3/zuck-keypoints.jpg" width=128>
            <p align="middle">mark zuckerberg with keypoints mask</p>
        </td>
    </tr>
</table>
</div>

## task 2: computing "midway face"
To compute the "midway face":
1. Find the average triangulation and keypoints between the two triangular mask.
> Although the relative structure of the triangular masks are the same, the coordinates are not exactly the same and therefore we need a triangular mask that is the composed of the average of the keypoints and their respective positions.
2. Warp the images to the average triangular mask, I used inverse warping
> For each triangle in the triangular mask:
>
> 1. Find the affine transformation matrix from avg keypoints to img keypoints. This can be done by using \`np.linalg.solve\`, where \`a\` is the avg keypoints matrix and \`b\` is the img keypoints matrix. Make sure that each keypoint is in this format: \`[x, y, 1]\`, since \`np.linalg.solve\` solves \`ax = b\` for \`x\`. The resulting affine transformation matrix will be \`A = x.T\`.
> 2. Use the affine matrix to find the points that correspond to the region in the avg triangle in the img triangle by doing \`A @ avg_points_matrix\`.
> 3. Use nearest neighbor interpolation to find the resulting img coordinates for transformed coordinates that are in between coordinates (aka are floats and not integers)
> 4. Place the image values that are located at the img coordinates derived from \`3.\` into the warped image array.

3. Cross-disolve the two warped images by taking the average of the RGB values of the warped images

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj3/clooney.jpg" width=128>
            <p align="middle">clooney</p>
        </td>
         <td>
            <img src="/images/proj3/clooney-zuck-avg-keypoints.jpg" width=128>
            <p align="middle">clooney and mark avg keypoints</p>
        </td>
        <td>
            <img src="/images/proj3/zuck.jpg" width=128>
            <p align="middle">zuck</p>
        </td>
    </tr>
</table>
</div>

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj3/clooney-warped.jpg" width=128>
            <p align="middle">clooney warped</p>
        </td>
        <td>
            <img src="/images/proj3/clooney-zuck-mean.jpg" width=128>
            <p align="middle">clooney and zuck mean face</p>
        </td>
        <td>
            <img src="/images/proj3/zuck-warped.jpg" width=128>
            <p align="middle">zuck warped</p>
        </td>
    </tr>
</table>
</div>

## task 3: morph sequence
Creating a morph sequence is similar to calculating the midway face but instead of keeping a constant warp alpha and dissolve alpha at 0.50, we do a linear interoplation of the the two constants to get a smooth transistion of morphs.

To create this linear interpolation, I just used \`np.linspace\` to create 45 alphas that can be in between the range of \`[0, 1]\`, since I want to create 45 frames of in-between morph sequences. Each frame uses the same alpha for warping and cross-dissolving, which seems to work fine. However, I think a smoother transition can be done if the warp alpha was a function of dissolve alpha for some function \`f\`. This probably needs a bit more testing and research before much more can be said.

<center>
<img src="/images/proj3/clooney-zuck.gif" alt="clooney-zuck-morph.gif" width=128>

> clooney-zuck-morph.gif
</center>


## task 4: "mean face" of population
I generated a mean face using the Danes dataset of annotated faces (30 males, 7 females).

To generate the mean face:
1. Find the average triangular mask of all the faces
2. Warp each img to the average triangular mask
3. Compute the average RGB values of all the warped images

<img src="./images/proj3/danes-mean-face.jpg" alt="" width=128>

> danes mean face

<div align="middle">
<table>
    <tr>
         <td>
            <img src="/images/proj3/swift-to-danes.jpg" width=128>
            <p align="middle">swift warped to danes mean face</p>
        </td>
        <td>
            <img src="/images/proj3/danes-to-swift.jpg" width=128>
            <p align="middle">danes mean face warped to swift</p>
        </td>
    </tr>
</table>
</div>

#### Examples of faces in dataset warped to danes mean face
<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj3/07-1m-warped.jpg" width=128>
            <p align="middle">07-1m</p>
        </td>
         <td>
            <img src="/images/proj3/12-1f-warped.jpg" width=128>
            <p align="middle">12-1f</p>
        </td>
    </tr>
    <tr>
        <td>
            <img src="/images/proj3/23-1m-warped.jpg" width=128>
            <p align="middle">23-1m</p>
        </td>
         <td>
            <img src="/images/proj3/31-1m-warped.jpg" width=128>
            <p align="middle">31-1m</p>
        </td>
    </tr>
</table>
</div>

## task 5: extrapolating from the mean (danish taylor swift)
Caricatures of a face can be derived from this formula: \`caricature = alpha * (average_keypoints - original_keypoints) + original_keypoints\`. Here are some with examples of Taylor Swift being more or less Danish by tuning the alpha.

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj3/swift-caricature--0.75.jpg" width=128>
            <p align="middle">alpha=-0.75</p>
        </td>
         <td>
            <img src="/images/proj3/swift-caricature--0.25.jpg" width=128>
            <p align="middle">alpha=-0.25</p>
        </td>
        <td>
            <img src="/images/proj3/swift-caricature-0.jpg" width=128>
            <p align="middle">alpha=0</p>
        </td>
       <td>
            <img src="/images/proj3/swift-caricature-0.25.jpg" width=128>
            <p align="middle">alpha=-0.25</p>
        </td>
        <td>
            <img src="/images/proj3/swift-caricature-0.75.jpg" width=128>
            <p align="middle">alpha=0.75</p>
        </td>
    </tr>
</table>
</div>

## bells and whistles

### gender swap
I created a female Mark Zuckerberg photo by morphing the Zuckerberg photo to the [average Australian Women photo](https://www.yahoo.com/lifestyle/the-best-part-of-having-an-average-face-105364187302.html). To morph only shape, the warp alpha was set to \`0.5\` while the dissolve alpha was set to \`0.0\`. To morph only appearance, the warp alpha was set to \`0.0\` while the dissolve alpha was set to \`0.5\`. To morph everything together, the both warp and dissolve alphas were set to \`0.5\`.

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj3/zuck.jpg" width=128>
            <p align="middle">zuck</p>
        </td>
        <td>
            <img src="/images/proj3/resized-zuck-keypoints.png" width=128>
            <p align="middle">avg Australian women keypoints</p>
        </td>
        <td>
            <img src="/images/proj3/avg-female-keypoints.png" width=128>
            <p align="middle">avg Australian women keypoints</p>
        </td>
        <td>
            <img src="/images/proj3/avg-women.jpeg" width=128>
            <p align="middle">avg Australian women face</p>
        </td>
    </tr>
</table>
</div>

<div align="center">
<table>
    <tr>
        <td>
            <img src="/images/proj3/female-zuck-shape.jpg" width=128>
            <p align="middle">warp=0.5, dissolve=0.0</p>
        </td>
       <td>
            <img src="/images/proj3/female-zuck-appearance.jpg" width=128>
            <p align="middle">warp=0.0, dissolve=0.5</p>
        </td>
        <td>
            <img src="/images/proj3/female-zuck.jpg" width=128>
            <p align="middle">warp=0.5, dissolve=0.5</p>
        </td>
    </tr>
</table>
</div>

### reflection
pretty fun project over all and learned more the applications of affine transformations in computer vision.`,C=`---
title: Filters + Frequencies
date: 2024.9.23
---

## task 1: fun with filters

### 1.1: finite difference operator

I first found partial derivative matrices by convolving \`Dx = np.array([[1, -1]])\` and \`Dy = np.array([[1], [-1]]\` with \`cameraman.png\` as a gray scale image matrix. I used \`scipy.signal.convolve2d\` with \`mode="same\` to keep the dimensionality of the matrix after convolutions. Afterwards, I created a gradient magnitude matrix by using the two partial derivative matrices derived earlier. \`g_m = np.sqrt(dx ** 2 + dy ** 2)\`.

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj2/task1.1-dx.jpg" width=128>
            <p align="middle">dx</p>
        </td>
        <td>
            <img src="/images/proj2/task1.1-dy.jpg" width=128>
            <p align="middle">dy</p>
        </td>
        <td>
            <img src="/images/proj2/task1.1-gm.jpg" width=128>
            <p align="middle">gradient magnitude</p>
        </td>
        <td>
            <img src="/images/proj2/task1.1-bin-gm.jpg" width=128>
            <p align="middle">binarized, thresh=0.25</p>
        </td>
    </tr>
</table>
</div>

### 1.2: derivative of gaussian filter (DoG)

I applied a gaussian blur first and then found the partial derivative matrices of the blurred image to see if it helps with edge detection. The gaussian kernel was created using \`cv2.getGaussianKernel\`, and the 2d gaussian filter was creating doing the outer product of the gaussian kernel on itself. The kernel size \`k\` was \`10 x 10\` and the sigma was \`(k-1) / 6\` since ["the length of for the 99th percentile of gaussian pdf is \`6 * sigma\`"](https://stackoverflow.com/a/62002971).

<div align="middle">
    <img src="/images/proj2/task1.2-blurred.jpg" width=128>
    <p>gaussian blurred cameraman.png</p>
</div>

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj2/task1.2-dx.jpg" width=128>
            <p align="middle">dx of blurred image</p>
        </td>
        <td>
            <img src="/images/proj2/task1.2-dy.jpg" width=128>
            <p align="middle">dy of blurred image</p>
        </td>
        <td>
            <img src="/images/proj2/task1.2-gm.jpg" width=128>
            <p align="middle">gradient magnitude</p>
        </td>
        <td>
            <img src="/images/proj2/task1.2-bin-gm.jpg" width=128>
            <p align="middle">binarized, thresh=0.05</p>
        </td>
    </tr>
</table>
</div>

Second method I tried was to first blur the derivative matrices by convolving the gaussing filter with the finite difference matrices. Afterwards, I convolved the newly transformed gaussian filters with the original image to find the gradient magnitude.

<div align="middle">
    <table>
        <tr>
            <td>
                <img src="/images/proj2/task1.2-dog-dogx.jpg" width=128>
                <p align="middle">dx of gaussian</p>
            </td>
            <td>
                <img src="/images/proj2/task1.2-dog-dogy.jpg" width=128>
                <p align="middle">dy of gaussian</p>
            </td>
        </tr>
    </table>
</div>

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj2/task1.2-dog-dx.jpg" width=128>
            <p align="middle">dx of blurred image</p>
        </td>
        <td>
            <img src="/images/proj2/task1.2-dog-dy.jpg" width=128>
            <p align="middle">dy of blurred image</p>
        </td>
        <td>
            <img src="/images/proj2/task1.2-dog-gm.jpg" width=128>
            <p align="middle">gradient magnitude</p>
        </td>
        <td>
            <img src="/images/proj2/task1.2-dog-bin-gm.jpg" width=128>
            <p align="middle">binarized, thresh=0.05</p>
        </td>
    </tr>
</table>
</div>

Both methods work well and the output resutls look basically the same. There might be slightly some more noise in the first one compared to the second one, but it is only noticable when gone a thorough examination of both images.

## task 2: fun with frequencies

### 2.1:  sharpening
Steps to sharpening an image:
1. Extract low frequencies of image via low pass filter. I used gaussian blur.
2. Extract high frequenceis of image via \`image - low\`.
3. Add high frequencies multipled by alpha back to image via \`image + alpha * high\`.

#### taj.jpg with alpha=1

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj2/task2.1-taj-1-low.jpg" width=128>
            <p align="middle">taj.jpg</p>
        </td>
        <td>
            <img src="/images/proj2/task2.1-taj-1-low.jpg" width=128>
            <p align="middle">low taj.jpg</p>
        </td>
        <td>
            <img src="/images/proj2/task2.1-taj-1-high.jpg" width=128>
            <p align="middle">high taj.jpg</p>
        </td>
        <td>
            <img src="/images/proj2/task2.1-taj-1-final.jpg" width=128>
            <p align="middle">sharpened taj.jpg, alpha=1</p>
        </td>
    </tr>
</table>
</div>

#### side note
> I used \`cv2\` operations since they automatically deal with out of range values. I tried using \`np.clip\` after doing np matrix operations before but \`cv2\` operations do a much better job.

#### taj.jpg
<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj2/taj.jpg" width=128>
            <p align="middle">alpha=0</p>
        </td>
        <td>
            <img src="/images/proj2/task2.1-taj-1-final.jpg" width=128>
            <p align="middle">alpha=1</p>
        </td>
        <td>
            <img src="/images/proj2/task2.1-taj-2-final.jpg" width=128>
            <p align="middle">alpha=2</p>
        </td>
        <td>
            <img src="/images/proj2/task2.1-taj-5-final.jpg" width=128>
            <p align="middle">alpha=5</p>
        </td>
        <td>
            <img src="/images/proj2/task2.1-taj-20-final.jpg" width=128>
            <p align="middle">alpha=20</p>
        </td>
    </tr>
</table>
</div>

#### mlord.png
<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj2/mlord.png" width=128>
            <p align="middle">alpha=0</p>
        </td>
        <td>
            <img src="/images/proj2/task2.1-mlord-1-final.jpg" width=128>
            <p align="middle">alpha=1</p>
        </td>
        <td>
            <img src="/images/proj2/task2.1-mlord-2-final.jpg" width=128>
            <p align="middle">alpha=2</p>
        </td>
        <td>
            <img src="/images/proj2/task2.1-mlord-5-final.jpg" width=128>
            <p align="middle">alpha=5</p>
        </td>
        <td>
            <img src="/images/proj2/task2.1-mlord-20-final.jpg" width=128>
            <p align="middle">alpha=20</p>
        </td>
    </tr>
</table>
</div>

#### nostudy.png
<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj2/nostudy.png" width=128>
            <p align="middle">alpha=0</p>
        </td>
        <td>
            <img src="/images/proj2/task2.1-nostudy-1-final.jpg" width=128>
            <p align="middle">alpha=1</p>
        </td>
        <td>
            <img src="/images/proj2/task2.1-nostudy-2-final.jpg" width=128>
            <p align="middle">alpha=2</p>
        </td>
        <td>
            <img src="/images/proj2/task2.1-nostudy-5-final.jpg" width=128>
            <p align="middle">alpha=5</p>
        </td>
        <td>
            <img src="/images/proj2/task2.1-nostudy-20-final.jpg" width=128>
            <p align="middle">alpha=20</p>
        </td>
    </tr>
</table>
</div>

I also tried "resharpening" an image by blurring an already sharp image and then sharpening it again.

#### nosleep.jpg

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj2/task2.1-nosleep-first-2-final.jpg" width=128>
            <p align="middle">initial sharpened image, alpha=2</p>
        </td>
        <td>
            <img src="/images/proj2/task2.1-nosleep-second-2-low.jpg" width=128>
            <p align="middle">blur of initial image</p>
        </td>
        <td>
            <img src="/images/proj2/task2.1-nosleep-second-2-final.jpg" width=128>
            <p align="middle">sharpen, alpha=2</p>
        </td>
    </tr>
</table>
</div>

>The resharpened image has more clear edges but has weird artifacts, presumably from creating previously nonexistant edges into edges. e.g. the face shading now has a bunch of weird cracks now.

### 2.2: hybrid images
To make make some hybrid images, align an the two images and then sum up one image's low frequencies and the other's high frequencies.

#### derek and nutmeg
<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj2/DerekPicture.jpg" width=128>
            <p align="middle">derek</p>
        </td>
        <td>
            <img src="/images/proj2/nutmeg.jpg" width=128>
            <p align="middle">nutmeg</p>
        </td>
        <td>
            <img src="/images/proj2/task2.2-cat-human-hybrid.jpg" width=128>
            <p align="middle">a furry</p>
        </td>
    </tr>
</table>
</div>

#### chimera
<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj2/fmanina.png" width=128>
            <p align="middle">nina from full metal alchemist</p>
        </td>
        <td>
            <img src="/images/proj2/fmadog.png" width=128>
            <p align="middle">nina's dog</p>
        </td>
        <td>
            <img src="/images/proj2/task2.2-fma-hybrid.jpg" width=128>
            <p align="middle">...</p>
        </td>
    </tr>
</table>
</div>

#### gogeta
<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj2/goku.png" width=128>
            <p align="middle">goku</p>
        </td>
        <td>
            <img src="/images/proj2/vegeta.png" width=128>
            <p align="middle">vegeta</p>
        </td>
        <td>
            <img src="/images/proj2/task2.2-gogeta.jpg" width=128>
            <p align="middle">fusion!</p>
        </td>
    </tr>
</table>
</div>

### frequency analysis

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj2/task2.2-goku-fft.jpg" width=128>
            <p align="middle">goku fft</p>
        </td>
       <td>
            <img src="/images/proj2/task2.2-goku-high-fft.jpg" width=128>
            <p align="middle">goku high freq fft</p>
        </td>
    </tr>
        <tr>
        <td>
            <img src="/images/proj2/task2.2-vegeta-fft.jpg" width=128>
            <p align="middle">vegeta fft</p>
        </td>
        <td>
            <img src="/images/proj2/task2.2-vegeta-low-fft.jpg" width=128>
            <p align="middle">vegeta low freq fft</p>
        </td>
    </tr>
    <tr>
        <td>
            <img src="/images/proj2/task2.2-gogeta-fft.jpg" width=128>
            <p align="middle">gogeta fft</p>
        </td>
    </tr>
</table>
</div>

The fft shows how the images align their frequencies an create the hybrid image of gogeta. You can tell via the white lines of frequencies from both images.

### 2.3: gaussian and laplacian stack

I did each stack to 10 layers.

#### gaussian stack of apple

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj2/task2.3-apple-gaus-0.jpg" width=128>
            <p align="middle">layer 0</p>
        </td>
        <td>
            <img src="/images/proj2/task2.3-apple-gaus-3.jpg" width=128>
            <p align="middle">layer 3</p>
        </td>
         <td>
            <img src="/images/proj2/task2.3-apple-gaus-6.jpg" width=128>
            <p align="middle">layer 6</p>
        </td>
        <td>
            <img src="/images/proj2/task2.3-apple-gaus-10.jpg" width=128>
            <p align="middle">layer 10</p>
        </td>
    </tr>
</table>
</div>

#### gaussian stack of orange
<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj2/task2.3-orange-gaus-0.jpg" width=128>
            <p align="middle">layer 0</p>
        </td>
        <td>
            <img src="/images/proj2/task2.3-orange-gaus-3.jpg" width=128>
            <p align="middle">layer 3</p>
        </td>
         <td>
            <img src="/images/proj2/task2.3-orange-gaus-6.jpg" width=128>
            <p align="middle">layer 6</p>
        </td>
        <td>
            <img src="/images/proj2/task2.3-orange-gaus-10.jpg" width=128>
            <p align="middle">layer 10</p>
        </td>
    </tr>
</table>
</div>

#### laplacian stack of apple

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj2/task2.3-apple-lap-0.jpg" width=128>
            <p align="middle">layer 0</p>
        </td>
        <td>
            <img src="/images/proj2/task2.3-apple-lap-3.jpg" width=128>
            <p align="middle">layer 3</p>
        </td>
         <td>
            <img src="/images/proj2/task2.3-apple-lap-6.jpg" width=128>
            <p align="middle">layer 6</p>
        </td>
        <td>
            <img src="/images/proj2/task2.3-apple-lap-10.jpg" width=128>
            <p align="middle">layer 10</p>
        </td>
    </tr>
</table>
</div>

#### laplacian stack of orange
<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj2/task2.3-orange-lap-0.jpg" width=128>
            <p align="middle">layer 0</p>
        </td>
        <td>
            <img src="/images/proj2/task2.3-orange-lap-3.jpg" width=128>
            <p align="middle">layer 3</p>
        </td>
         <td>
            <img src="/images/proj2/task2.3-orange-lap-6.jpg" width=128>
            <p align="middle">layer 6</p>
        </td>
        <td>
            <img src="/images/proj2/task2.3-orange-lap-10.jpg" width=128>
            <p align="middle">layer 10</p>
        </td>
    </tr>
</table>
</div>

### 2.4: multiresolution blending

#### oraple
please forigve me as i accidentally did 1 more layer than the paper itself.
<div align="middle">
<table>
    <tr>
        <td>
            <p align="middle">layer 0</p>
        </td>
        <td>
            <img src="/images/proj2/task2.4-oraple-0-l1-mask.jpg" width=128>
            <p align="middle">apple</p>
        </td>
        <td>
            <img src="/images/proj2/task2.4-oraple-0-l2-mask.jpg" width=128>
            <p align="middle">orange</p>
        </td>
         <td>
            <img src="/images/proj2/task2.4-oraple-0.jpg" width=128>
            <p align="middle">combined</p>
        </td>
    </tr>
    <tr>
        <td>
            <p align="middle">layer 2</p>
        </td>
        <td>
            <img src="/images/proj2/task2.4-oraple-2-l1-mask.jpg" width=128>
            <p align="middle">apple</p>
        </td>
        <td>
            <img src="/images/proj2/task2.4-oraple-2-l2-mask.jpg" width=128>
            <p align="middle">orange</p>
        </td>
         <td>
            <img src="/images/proj2/task2.4-oraple-2.jpg" width=128>
            <p align="middle">combined</p>
        </td>
    </tr>
    <tr>
        <td>
            <p align="middle">layer 4</p>
        </td>
        <td>
            <img src="/images/proj2/task2.4-oraple-4-l1-mask.jpg" width=128>
            <p align="middle">apple</p>
        </td>
        <td>
            <img src="/images/proj2/task2.4-oraple-4-l2-mask.jpg" width=128>
            <p align="middle">orange</p>
        </td>
         <td>
            <img src="/images/proj2/task2.4-oraple-4.jpg" width=128>
            <p align="middle">combined</p>
        </td>
    </tr>
    <tr>
        <td>
            <p align="middle">layer 7</p>
        </td>
        <td>
            <img src="/images/proj2/task2.4-oraple-7-l1-mask.jpg" width=128>
            <p align="middle">apple</p>
        </td>
        <td>
            <img src="/images/proj2/task2.4-oraple-7-l2-mask.jpg" width=128>
            <p align="middle">orange</p>
        </td>
         <td>
            <img src="/images/proj2/task2.4-oraple-7.jpg" width=128>
            <p align="middle">combined</p>
        </td>
    </tr>
</table>
</div>

#### oraple horizontal
<table>
    <tr>
        <td>
            <img src="/images/proj2/apple.jpeg" width=128>
            <p align="middle">apple</p>
        </td>
        <td>
            <img src="/images/proj2/orange.jpeg" width=128>
            <p align="middle">orange</p>
        </td>
        <td>
            <img src="/images/proj2/task2.4-oraple-horizontal-mask.jpg" width=128>
            <p align="middle">mask</p>
        </td>
         <td>
            <img src="/images/proj2/task2.4-oraple-horizontal-blend.jpg" width=128>
            <p align="middle">combined</p>
        </td>
    </tr>
</table>

#### kirby
<table>
    <tr>
        <td>
            <img src="/images/proj2/kirby.jpg" width=128>
            <p align="middle">kirby</p>
        </td>
        <td>
            <img src="/images/proj2/kirby_blue.jpg" width=128>
            <p align="middle">kirby blue</p>
        </td>
        <td>
            <img src="/images/proj2/task2.4-kirby-mask.jpg" width=128>
            <p align="middle">mask</p>
        </td>
         <td>
            <img src="/images/proj2/task2.4-kirby-blend.jpg" width=128>
            <p align="middle">combined</p>
        </td>
    </tr>
</table>

#### gudetama breakfast (fail)
<table>
    <tr>
        <td>
            <img src="/images/proj2/gudetama.png" width=128>
            <p align="middle">gudetama</p>
        </td>
        <td>
            <img src="/images/proj2/breakfast.jpg" width=200>
            <p align="middle">breakfast</p>
        </td>
        <td>
            <img src="/images/proj2/task2.4-gudetama-mask.jpg" width=128>
            <p align="middle">mask</p>
        </td>
         <td>
            <img src="/images/proj2/task2.4-gudetama-blend.jpg" width=128>
            <p align="middle">combined</p>
        </td>
    </tr>
</table>

#### here's a cursed egg instead
<table>
    <tr>
        <td>
            <img src="/images/proj2/egg.jpeg" width=128>
            <p align="middle">gudetama</p>
        </td>
        <td>
            <img src="/images/proj2/breakfast.jpg" width=128>
            <p align="middle">breakfast</p>
        </td>
        <td>
            <img src="/images/proj2/task2.4-cursed-egg-mask.jpg" width=128>
            <p align="middle">mask</p>
        </td>
         <td>
            <img src="/images/proj2/task2.4-cursed-egg-blend.jpg" width=128>
            <p align="middle">combined</p>
        </td>
    </tr>
</table>


### reflection
pretty fun project overall. learned how frequencies worked and basically how photoshop works with masking. made some fun references to some of my favorite animes :).`,F=`---
title: Image Stitching
date: 2024.10.20
---

# Manual Image Stitching and Mosaic

In the first part of this project, I will be attempting to stich photos taken from the same focal point but at different angles by using homographies and 2-band frequency blending.

## Photos Used

#### wallet for rectification
<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj4/wallet.jpg" width=256>
        </td>
    </tr>
</table>
</div>

#### laptop for rectification
<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj4/laptop.jpg" width=256>
        </td>
    </tr>
</table>
</div>


#### desk for mosaic stitching
<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj4/desk-0.jpg" width=256>
        </td>
        <td>
            <img src="/images/proj4/desk-1.jpg" width=256>
        </td>
    </tr>
</table>
</div>


#### another messy desk for mosaic stitching
<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj4/monitor-0.jpg" width=256>
        </td>
        <td>
            <img src="/images/proj4/monitor-1.jpg" width=256>
        </td>
    </tr>
</table>
</div>

#### bed for mosaic stitching
<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj4/bed-0.jpg" width=256>
        </td>
        <td>
            <img src="/images/proj4/bed-1.jpg" width=256>
        </td>
        <td>
            <img src="/images/proj4/bed-2.jpg" width=256>
        </td>
    </tr>
</table>
</div>

#### safeway for mosaic stitching
<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj4/safeway-0.jpg" width=256>
        </td>
        <td>
            <img src="/images/proj4/safeway-1.jpg" width=256>
        </td>
        <td>
            <img src="/images/proj4/safeway-2.jpg" width=256>
        </td>
    </tr>
</table>
</div>


## Recovering Homographies
We need to use a homography matrix in other to conduct a perspective warp (or transformation). A perspective warp utilizes eight degrees of freedom to warp one image to another.

The Homography matrix H is defined to be:

<div align="middle">
    <img src="/images/proj4/homography.png" width=320>
</div>

To find the the "weights" of the homography matrix, I used the formula described in this [paper](https://cseweb.ucsd.edu/classes/wi07/cse252a/homography_estimation/homography_estimation.pdf). To summarize, given \`src_points = (x1, y1)\` and \`dest_points = (x2, y2)\`, I create a matrix \`A\` such that \`a_x = [-x1, -y1, -1, 0, 0, 0, x1 * x2, y1 * x2, x2]\` and \`a_y = [0, 0, 0, -x1, -y1, -1, x1 * y2, y1 * y2, y2]\`. I then compute the SVD of matrix \`A\` to find \`V.T\`. The last column of \`V.T\` reshaped into a \`3x3\` matrix and then normalized such that the last element at index \`(2, 2)\` (according to 0 indexing) is \`1.0\` is the Homography matrix we are looking for.

> Side note: To normalize the Homography matrix with respect to the last element is just to divide each element of the column vector \`V.T\` by the last element of the \`V.T\` and then respahing \`V.T\` into the shape \`(3, 3)\`

## Rectification

To test the homography matrices, I first took some photos of rectangular objects at an angle and then warped those images to rectangles (aka rectifying them). Just to note, the \`src_points\` of \`computeHomography\` come from keypoints mapped on the angled photo while the \`dest_points\` of \`computeHomography\` is just some points that form a rectangle that is relative to the size of the image.

#### laptop.jpg
<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj4/laptop.jpg" width=256>
            <p align="middle">laptop</p>
        </td>
        <td>
            <img src="/images/proj4/laptop-rect.jpg" width=256>
            <p align="middle">laptop rectified</p>
        </td>
    </tr>
</table>
</div>

#### wallet.jpg
<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj4/wallet.jpg" width=256>
            <p align="middle">wallet</p>
        </td>
        <td>
            <img src="/images/proj4/wallet-rect.jpg" width=256>
            <p align="middle">wallet rectified</p>
        </td>
    </tr>
</table>
</div>

## Mosaic Stitching

I used 2-frequency blending to blend the mosaic together. This was achieved by using laplacian stacks on the images and a gaussian stack on the mask with a depth of \`2\`. The boundary in the mask was determined to be the middle split of region of intersections between the images.

### Caveats
Since my images were huge (around \`4000 x 3000\`), my gaussian kernel had to be huge for the blur between edges to be noticable. However, having a huge kernel takes a long time to compute. After some testing, a kernel with \`k = 25\` took around one minute to compute; a kernel with \`k = 50\` took around five minutes to compute; a kernel with \`k = 100\` took around twenty minutes to compute. I ended up going with using \`k = 50\` to compute my blurs since it produced a similar output as \`k = 100\` with a reasonable runtime.
I also wrote code to find the approximate edge between the two images. Then, I created a bounding box that contained both images and blended the bounding box to reduce runtime as blending the entire image would've taken a longer time. In retrospect, if I were to layer multiple images at once, this algorithm would run slower as I would have to find a bounding box for each edge and run the blending on each bounding box individually. In that regard, I would just run the 2-band blending on the whole image.

My phone camera seems to ***auto adjust*** the lighting after taking a photo, and I do not know how to turn off this feature. Therefore, my photos that I stitched together seems to have different lighting even though they were taken in the same setting at the same time. This caused the images look a bit funky after the stitching process. I tried my best to take photos in a setting where the auto color correction wouldn't change too much in between photos, but it is still a tiny bit noticable in some photos. Maybe I can code an auto color correction algorithm such that the images are in the relatively same lighting in the future to fix this.

### desk.jpg
<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj4/desk-0.jpg" width=256>
            <p align="middle">left</p>
        </td>
        <td>
            <img src="/images/proj4/desk-1.jpg" width=256>
            <p align="middle">right</p>
        </td>
    </tr>
</table>
<img src="/images/proj4/desk-mosaic-1.jpg" width=256>
<p align="middle">final</p>
</div>

### [failed] desk.jpg with left, right, middle
<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj4/desk-0.jpg" width=256>
            <p align="middle">left</p>
        </td>
        <td>
            <img src="/images/proj4/desk-1.jpg" width=256>
            <p align="middle">middle</p>
        </td>
        <td>
            <img src="/images/proj4/desk-2.jpg" width=256>
            <p align="middle">right</p>
        </td>
    </tr>
</table>
<img src="/images/proj4/desk-mosaic-2.jpg" width=256>
<p align="middle">final</p>
</div>

> I think for this bigger mosaic I messed up the when taking the photos such that the \`right\` photo didn't have the same \`center of projection\` as the \`left\` and \`middle\` photos. Either that or I messed up the corrspondence points. I think the former is the more likely culprit.

### monitor.jpg (aka messy desk part 2)

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj4/monitor-0.jpg" width=256>
            <p align="middle">left</p>
        </td>
        <td>
            <img src="/images/proj4/monitor-1.jpg" width=256>
            <p align="middle">right</p>
        </td>
    </tr>
</table>
<img src="/images/proj4/monitor-mosaic-1.jpg" width=256>
<p align="middle">final</p>
</div>

### [failed] bed.jpg
<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj4/bed-0.jpg" width=256>
            <p align="middle">left</p>
        </td>
        <td>
            <img src="/images/proj4/bed-1.jpg" width=256>
            <p align="middle">right</p>
        </td>
    </tr>
</table>
<img src="/images/proj4/bed-mosaic-1.jpg" width=256>
<p align="middle">final</p>
</div>

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj4/bed-2.jpg" width=256>
            <p align="middle">left</p>
        </td>
        <td>
            <img src="/images/proj4/bed-1.jpg" width=256>
            <p align="middle">middle</p>
        </td>
        <td>
            <img src="/images/proj4/bed-0.jpg" width=256>
            <p align="middle">right</p>
        </td>
    </tr>
</table>
<img src="/images/proj4/bed-mosaic-2.jpg" width=256>
<p align="middle">final</p>
</div>

> Phone camera lighting auto adjustment issue as mentioned in caveats.

### safeway.jpg
<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj4/safeway-0.jpg" width=256>
            <p align="middle">left</p>
        </td>
        <td>
            <img src="/images/proj4/safeway-1.jpg" width=256>
            <p align="middle">right</p>
        </td>
    </tr>
</table>
<img src="/images/proj4/safeway-mosaic-1.jpg" width=256>
<p align="middle">final</p>
</div>

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj4/safeway-0.jpg" width=256>
            <p align="middle">left</p>
        </td>
        <td>
            <img src="/images/proj4/safeway-1.jpg" width=256>
            <p align="middle">middle</p>
        </td>
        <td>
            <img src="/images/proj4/safeway-2.jpg" width=256>
            <p align="middle">right</p>
        </td>
    </tr>
</table>
<img src="/images/proj4/safeway-mosaic-2.jpg" width=256>
<p align="middle">final</p>
</div>

### Reflection
I overall enjoyed taking photos and then stitching the images into mosaics. I had some trouble getting the images to have the same lighting, due to the nature of my phone camera which auto adjusts the image after it being taken. Furthermore the images taken from different angles affected how much light the camera was receiving and therefore may have affected the lighting of the photos and mad the stiching look weird and the photos with different lighting. I think I could've implemented an auto color correction or averaging algorithm between the images to solve this issue from a software standpoint, but I didn't have enough time to implement this during this project due to the heavy courseload I'm taking this semester. Maybe I will come back later, to try to implement a better stitching algorithm as well as a color correction algorithm.

# [Auto]-Stitching and Mosaics

Time for the fun part. Also, a lot of the work here was based on this paper: [“Multi-Image Matching using Multi-Scale Oriented Patches” by Brown et al.](https://inst.eecs.berkeley.edu/~cs180/fa24/hw/proj4/Papers/MOPS.pdf).

## Harris Coner Detection
Harris corner detection takes in a grayscale image and computes the horizontal and vertical derivatives at each pixel along the image using a shifting window. If there's barely any cahnge, there's no notable edges or corners. If there's a lot of change in one direction we know there's an edge. If there's a lot of change in all directions, then we know there's a corner. To learn more, here's the [wikipedia](https://en.wikipedia.org/wiki/Harris_corner_detector) and [opencv documentation](https://docs.opencv.org/4.x/dc/d0d/tutorial_py_features_harris.html) with more detailed math and explanations.

### Caveats
The Harris corner detection algorithm is a bit brute force like and takes a long runtime with a huge image (like my phones photos are roughly 4000 x 3000). Hence, for this part of the project I will be downsampling (with anti-anlising) my images.

The Harris corner detetion detected around \`18000\` points in total on the ***downsampled*** image. For display purposes, I only plotted the first \`5000\` points.

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj4/desk-0-downsampled.jpg" width=256>
            <p align="middle">original downsampled</p>
        </td>
        <td>
            <img src="/images/proj4/desk-harris-5000.jpg" width=256>
            <p align="middle">5000 points</p>
        </td>
    </tr>
</table>
</div>

## Adaptive Non-Maximal Suppression (ANMS)

There are too many points produced by the Harris corner detection algorithm. In order to filter the points, I used the adaptive non-maximal suppression (ANMS) algorithm. The basic idea is to remove keypoints that are not the strongest in their local neighborhood. To achieve this, we need some strength metric that can be measured between two points. This strength metric (or strength funciton \`f\` however you want to see it) can be obtain by creating a measure of how corner-like a point is from the Harris corner detection (this metric is produced while going thorugh Harris detection). Now that the strength metric is decided, we can move on to how the suppression works. We want each point to have a radius \`r\` that determines how far it is from its nearest neighbor. We want to minimize this distance such that the the strength metric of the current point \`f(x)\` is sufficiently suppressed by a neighboring point's strength metric under a threshold contraint \`threshold * f(y)\`. In order to find the best points, we want to find points with the largest \`r\`. For my specific use case, I just took the the top 500 points and set the \`threshold = 0.9\`.

<img src="/images/proj4/anms.png" width=320>

> Here's the minimization problem.

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj4/desk-0-downsampled.jpg" width=256>
            <p align="middle">original downsampled</p>
        </td>
        <td>
            <img src="/images/proj4/desk-anms-500.jpg" width=256>
            <p align="middle">500 points</p>
        </td>
    </tr>
</table>
</div>

## Feature Descriptor Extraction
Although we found a bunch of points, we can find points on two images, but still don't know which point corresponds to what point. In order to pinpoint correspondence, we will see if features match up. First, we gotta extract the feature at each point.

To generate features at a *particular* point:
1. Convert image to grayscale
2. Create a \`(40, 40)\` window at the point
3. Downsize the descriptor window to \`(8, 8)\`
4. Bias-Gain normalize the downsized descriptor (\`D' = (D - mu) / sigma\`)

> These feature descriptors are called "Multi-Scale Oriented Patches" (MOPS) as mentioned in the paper.

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj4/desk0-feature-desc-0.jpg" width=128>
        </td>
        <td>
            <img src="/images/proj4/desk0-feature-desc-100.jpg" width=128>
        </td>
        <td>
            <img src="/images/proj4/desk0-feature-desc-200.jpg" width=128>
        </td>
        <td>
            <img src="/images/proj4/desk0-feature-desc-300.jpg" width=128>
        </td>
        <td>
            <img src="/images/proj4/desk0-feature-desc-400.jpg" width=128>
        </td>
    </tr>
</table>
</div>

## Feature Matching
In order to feature match, we need some kind of metric to determine how features match. To do this, I used \`sum squared error\` to determine the difference between one feature and another. The less error, the more similar the features are.

However, features can match but not be at the same point. In order to differentiate features, we can use Lowe's approach. Lowe suggested that one can determine if a feature corresponds to another specific similar feature if it is very unsimilar to the next closest similar image. To determine this we can use the ratio of errors between the most similar feature and the next most similar feature dentoed by \`e_1 / e_2\`. If the error ratio is below some certain \`lowe_threshold\`, then we can say that the features aren't that similar and hence state that the most similar feature is the corresponding feature we are looking for. After some emprical testing, the paper concluded that \`lowe_threshold = 0.2\` is pretty good in getting correct matches, which is what I used.

In this case we can say that "most similar" can be anagolous to "nearest neigbor" and that we can use a nearest neighbor algorithm to determine the most similar features corresponding to a particular feature. In this case, we can use \`kd-trees\`. I didn't implement it, but I think I can do so in the future when I'm a bit less busy :(. Instead of using \`kd-trees\`, I just brute-forced 500 pairwise \`ssd errors\` using some nice np matrix and vector techniques, which runtime wise was not bad.

#### Some desk-0.jpg and desk-1.jpg feature matches

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj4/feature-pairs0-0.jpg" width=128>
        </td>
        <td>
            <img src="/images/proj4/feature-pairs1-0.jpg" width=128>
        </td>
    </tr>
     <tr>
        <td>
            <img src="/images/proj4/feature-pairs0-14.jpg" width=128>
        </td>
        <td>
            <img src="/images/proj4/feature-pairs1-14.jpg" width=128>
        </td>
    </tr>
     <tr>
        <td>
            <img src="/images/proj4/feature-pairs0-29.jpg" width=128>
        </td>
        <td>
            <img src="/images/proj4/feature-pairs1-29.jpg" width=128>
        </td>
    </tr>
     <tr>
        <td>
            <img src="/images/proj4/feature-pairs0-43.jpg" width=128>
        </td>
        <td>
            <img src="/images/proj4/feature-pairs1-43.jpg" width=128>
        </td>
    </tr>
     <tr>
        <td>
            <img src="/images/proj4/feature-pairs0-58.jpg" width=128>
        </td>
        <td>
            <img src="/images/proj4/feature-pairs1-58.jpg" width=128>
        </td>
    </tr>
</table>
</div>

## Random Sample Consensus (RANSAC)

[RANSAC](https://en.wikipedia.org/wiki/Random_sample_consensus) is an iterative model to estimate parameters. Specifically for this case, we are trying to find the homography matrix that produces the most accurate predictions. Here are the steps I took when running RANSAC on the feature matched points to further pinpoint which points are needed.

For \`n = 1000\` steps:

1. Choose 4 random points from feature matched points pairs
2. \`computeHomography(pair1_points, pair2_points)\`
3. Calculate the predicted points using \`p2' = H @ p1\` (remember to normalize each point in \`p2'\` wrt to the its resulting constant)
4. Add all \`(p1, p2)\` pairs to \`inliers\` list that satisfy the condition \`dist(p2' - p2) < e\` where \`e\` is the max error you are willing to allow. I set \`e = 1\` so the max difference is 1 pixel.
5. If the current \`inliers\` list has more points than \`best_inliers\`, update \`best_inliers\`.

Compute best estimated homography using least squares and \`best_inliers\` as input.

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj4/desk0-ransac-inliers.jpg" width=256>
            <p align="middle">desk0.jpg</p>
        </td>
        <td>
            <img src="/images/proj4/desk1-ransac-inliers.jpg" width=256>
            <p align="middle">desk1.jpg</p>
        </td>
    </tr>
</table>
</div>

> For this example, RANSAC reduced \`73\` feature match pairs into \`47\` correspondence pairs.

## Homography Estimation + Stitching
I used the same stitching method as I did from Part A of this project. The only difference is that we're now using the homography matrix estimated from RANSAC and feature matching. I think the estimation did a pretty good job, but it seems to be slightly lacking compared to manually matching correspondence. But what can you expect, I think it did amazingly well for automatic homography estiamtion.

### desk.jpg

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj4/desk-mosaic-1.jpg" width=256>
            <p align="middle">manual</p>
        </td>
        <td>
            <img src="/images/proj4/desk-automosaic-1.jpg" width=256>
            <p align="middle">auto</p>
        </td>
    </tr>
</table>
</div>

### monitor.jpg (aka messy desk part 2)

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj4/monitor-mosaic-1.jpg" width=256>
            <p align="middle">manual</p>
        </td>
        <td>
            <img src="/images/proj4/monitor-automosaic-1.jpg" width=256>
            <p align="middle">auto</p>
        </td>
    </tr>
</table>
</div>

### safeway.jpg

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj4/safeway-mosaic-1.5.jpg" width=256>
            <p align="middle">manual</p>
        </td>
        <td>
            <img src="/images/proj4/safeway-automosaic-1.5.jpg" width=256>
            <p align="middle">auto</p>
        </td>
    </tr>
</table>
</div>

### [for fun] bed.jpg
<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj4/bed-mosaic-1.jpg" width=256>
            <p align="middle">manual</p>
        </td>
        <td>
            <img src="/images/proj4/bed-automosaic-1.jpg" width=256>
            <p align="middle">auto</p>
        </td>
    </tr>
    <tr>
        <td>
            <img src="/images/proj4/bed-mosaic-2.jpg" width=256>
            <p align="middle">manual</p>
        </td>
        <td>
            <img src="/images/proj4/bed-automosaic-2.jpg" width=256>
            <p align="middle">auto</p>
        </td>
    </tr>
</table>
</div>

### Reflection
I learned a lot about various techniques on auto feature detection and using derivatives/moments to capture feature textures. I've also noticed that feature detection isn't just based on one single algorithm but rather multiple algorithms that detect multiple things that compose of the feature. Additionally, one can first get a lot of data and then pinpoint the good data/filter out the useless data to capture the features we want. Overall pretty fun project and I can't wait to see how neural networks come into play in the next project (maybe?).`,D=`---
title: Neural Radiance Fields (NeRF)
date: 2024.12.13
---

Exploring multiview stereo (MVS) correspondence by recreating [NeRF](https://arxiv.org/pdf/2003.08934).

<center>
<img src="/images/proj6/lego-nerf-test.gif" width=128 height=128>
</center>

## Part 1: 2D MLP
Basically, for this model, it converts a \`B x 2\` batch of 2D coordinates and then converts it in to a \`B x 3\` batch of rgb values corresponding to those 2D coordinates. That way, I can generate a specifc image from a coordinate system of pixels (important for later). It first takes in the vector $X$. Then, pass it through a Sinusoidal Positional Encoding (SPE) to convert 2D coordinates into 3D coordinates. Then pass the 3D coordinates through a bunch of \`256\` sized Linear -> ReLU layers. Finally, at the end \`3\` sized Linear layer, pass the 3d coordinates through a Sigmoid Layer to predict a specific pixel coordinate's RGB value.

Here's the architecture for the MLP.

<img src="/images/proj6/mlp_img.jpg" alt="img" width=640>

### fox.jpg

I initially trained the \`fox.jpg\` model with the following parameters: \`lr=1e-2\`, \`num_layers=3\`, \`batch_size=10_000\`, \`L=10\` and \`iterations=3000\`. (where lr is learning rate, num_layers is the number of linear/ReLU layers there are, and L being the max frequency for the SPE) I used Mean Squared Error Loss and the ADAM optimizer for training. Furthermore, I also used the Peak Signal-to-Noise  Ratio (PSNR) as a measure to determine how "good" an image was.

$$
PSNR = 10 \\cdot log_{10}\\left(\\frac{1}{MSE}\\right)
$$

Here are some images of the the reconstructed image during some of the iterations of the training process with the default hyperparameters:

<center>
<table>
    <tr>
        <td align="center">
            <img src="/images/proj6/fox-reconstructed-iter=0-lr=0.01-L=10-layers=3.jpg" width=128>
            <p>Iteration 0</p>
        </td>
        <td align="center">
            <img src="/images/proj6/fox-reconstructed-iter=100-lr=0.01-L=10-layers=3.jpg" width=128>
            <p>Iteration 100</p>
        </td>
        <td align="center">
            <img src="/images/proj6/fox-reconstructed-iter=200-lr=0.01-L=10-layers=3.jpg" width=128>
            <p>Iteration 200</p>
        </td>
    </tr>
    <tr>
        <td align="center">
            <img src="/images/proj6/fox-reconstructed-iter=500-lr=0.01-L=10-layers=3.jpg" width=128>
            <p>Iteration 500</p>
        </td>
        <td align="center">
            <img src="/images/proj6/fox-reconstructed-iter=700-lr=0.01-L=10-layers=3.jpg" width=128>
            <p>Iteration 700</p>
        </td>
        <td align="center">
            <img src="/images/proj6/fox-reconstructed-lr=0.01.jpg" width=128>
            <p>Final</p>
        </td>
    </tr>
</table>
</center>

Here are some of the model's performance after training on varying \`learning rates\` and the other hyperparameters remain the same.

<img src="/images/proj6/fox-lr-stats.jpg" alt="img" width=640>

Here are some images of the the reconstructed image during some of the iterations of the training process with the default hyperparameters \`lr=1e-5\`:

<center>
<table>
    <tr>
        <td align="center">
            <img src="/images/proj6/fox-reconstructed-iter=0-lr=1e-05-L=10-layers=3.jpg" width=128 height=128>
            <p>Iteration 0</p>
        </td>
        <td align="center">
            <img src="/images/proj6/fox-reconstructed-iter=200-lr=1e-05-L=10-layers=3.jpg" width=128 height=128>
            <p>Iteration 200</p>
        </td>
        <td align="center">
            <img src="/images/proj6/fox-reconstructed-iter=500-lr=1e-05-L=10-layers=3.jpg" width=128 height=128>
            <p>Iteration 500</p>
        </td>
        <td align="center">
            <img src="/images/proj6/fox-reconstructed-iter=700-lr=1e-05-L=10-layers=3.jpg" width=128 height=128>
            <p>Iteration 700</p>
        </td>
        <td align="center">
            <img src="/images/proj6/fox-reconstructed-lr=1e-05.jpg" width=128 height=128>
            <p>Final</p>
        </td>
    </tr>
</table>
</center>

Here are some of the model's performance after training on varying \`number of layers\` in the model and the other hyperparameters remain the same.

<img src="/images/proj6/fox-num-layers-stats.jpg" alt="img" width=640>

Here are some images of the the reconstructed image during some of the iterations of the training process with the default hyperparameters \`num_layers=7\`:

<center>
<table>
    <tr>
        <td align="center">
            <img src="/images/proj6/fox-reconstructed-iter=0-lr=0.01-L=10-layers=7.jpg" width=128 height=128>
            <p>Iteration 0</p>
        </td>
        <td align="center">
            <img src="/images/proj6/fox-reconstructed-iter=100-lr=0.01-L=10-layers=7.jpg" width=128 height=128>
            <p>Iteration 100</p>
        </td>
        <td align="center">
            <img src="/images/proj6/fox-reconstructed-iter=200-lr=0.01-L=10-layers=7.jpg" width=128 height=128>
            <p>Iteration 200</p>
        </td>
    </tr>
    <tr>
        <td align="center">
            <img src="/images/proj6/fox-reconstructed-iter=500-lr=0.01-L=10-layers=7.jpg" width=128 height=128>
            <p>Iteration 500</p>
        </td>
        <td align="center">
            <img src="/images/proj6/fox-reconstructed-iter=700-lr=0.01-L=10-layers=7.jpg" width=128 height=128>
            <p>Iteration 700</p>
        </td>
        <td align="center">
            <img src="/images/proj6/fox-reconstructed-num_layers=7.jpg" width=128 height=128>
            <p>Final</p>
        </td>
    </tr>
</table>
</center>

### cat.jpg
Here's the MLP network ran with all default parameters and also varying learning rates.

<img src="/images/proj6/cat-lr-stats.jpg" alt="img" width=640>

Here's some iterations of \`cat.jpg\` with \`lr=0.001\` (max frequency) and other default hyperparamaters.

<center>
<table>
    <tr>
        <td align="center">
            <img src="/images/proj6/cat-reconstructed-iter=0-lr=0.001-L=10-layers=3.jpg" width=128 height=128>
            <p>Iteration 0</p>
        </td>
        <td align="center">
            <img src="/images/proj6/cat-reconstructed-iter=100-lr=0.001-L=10-layers=3.jpg" width=128 height=128>
            <p>Iteration 100</p>
        </td>
        <td align="center">
            <img src="/images/proj6/cat-reconstructed-iter=200-lr=0.001-L=10-layers=3.jpg" width=128 height=128>
            <p>Iteration 200</p>
        </td>
    </tr>
    <tr>
        <td align="center">
            <img src="/images/proj6/cat-reconstructed-iter=500-lr=0.001-L=10-layers=3.jpg" width=128 height=128>
            <p>Iteration 500</p>
        </td>
        <td align="center">
            <img src="/images/proj6/cat-reconstructed-iter=700-lr=0.001-L=10-layers=3.jpg" width=128 height=128>
            <p>Iteration 700</p>
        </td>
        <td align="center">
            <img src="/images/proj6/cat-reconstructed-lr=0.001.jpg" width=128 height=128>
            <p>Final</p>
        </td>
    </tr>
</table>
</center>

## Part 2: NeRF

### transform(c2w, x_c)
I batched transformed 3D camera coordinates \`x_c\` into world coordinates using the camera to world \`c2w\` transformation matrix. I matrix multiplied by batch using \`torch.bmm()\`. This formula is the conversion from world coordinates to image coordinates using the world to camera coordinate transformation matrix \`w2c\`. Keep in mind that that coordinates are stored \`(B, 3)\` tensors, while the formula is in \`3 x 1\` vectors for coordinates, so overall,I implemented the transpose of the formula after moving everything to one side by inversing the \`w2c\` matrix to get the \`c2w\` matrix.

<center>
<img src="/images/proj6/transform.png" width=320>
</center>

### pixel_to_camera(K, uv, s)
Given the focal depth of the camera and the image dimensions, one can create the intrinsic matrix $K$.

<center>
<img src="/images/proj6/K.png" width=320>
</center>

$K$ is then used to project a 3D point into the camera coordinate \`x_c\` system using 2D pixel coordinates \`uv\` of an image. \`s\` here is used to provide to the depth to the 2D pixel coordinate so that it can be translated into 3D camera coordinates. Once again, I implemented the transpose of the formula for batched operations so it will be faster.

<center>
<img src="/images/proj6/pixel2cam.png" width=320>
</center>

### pixel_to_ray(K, c2w, uv)
Given pixel coordinates, intrinsic matrix $K$, and \`c2w\` transformation matrix, we can find the origin of the camera and produce rays that will represent the camera's line of sight and how a 3D world coordinate is projected onto the image as a pixel from the camera's point of view.

The origin ray is calculated via this formula, where $R_{3x3}$ and $t$ is from the \`w2c\` matrix mentioned above.

$$
\\begin{align} \\mathbf{r}_o =
      -\\mathbf{R}_{3\\times3}^{-1}\\mathbf{t} \\end{align}
$$

The distance ray is calculated by this formula, where $X_w$ are world coordinates. The direction array is then noramlized into a unit vector norm using the l2 (or euclidan) norm.

$$
\\begin{align} \\mathbf{r}_d = \\frac{\\mathbf{X_w} - \\mathbf{r}_o}{||\\mathbf{X_w} -
      \\mathbf{r}_o||_2} \\end{align}
$$

Once again, I used \`torch.bnn()\` for batched matrix multiplications for faster operations.

### Sampling Rays
I created a \`RaysDataset\` class that contains all the pixel values and calculate ray values based off of pixel coordinates when sampled. Therfore, the sampling function was also built into this data set with a parameter \`batch\` for batch size.

When sampling, I flattened all coordinates of images in the image dataset into a 2D tensor and then used \`torch.randint\` to generate a list of random pixels to sample and rays to generate. I then returned a tuple containing \`(batch, ...)\` sized tensors of the origin rays \`ray_o\`, the direction rays \`ray_d\` and the pixel values of said coordinate \`pixels\`.

> Also all data was normalized for easier computation. i.e. RGB / 255.0

### Sampling Plenoptic Points
Now that we have sampled random camera origins and camera directions (corresponding to image pixels), we can now sample points along this ray to get points that are represented by the Plenoptic function. This function is crucial to implement and I had several bugs where the \`(u, v)\` coordinates didn't correspond with the rays, or where \`(u, v)\` was flipped to \`(v, u)\`.

These points along with their direction ray correspondence then can be used to train a MLP deep neural network to output color and density values.

Here are the sampled rays from all cameras.
<center>
<img src="/images/proj6/allcams.png" width=640>
</center>


Here are the sampled rays from one camera
<center>
<img src="/images/proj6/onecam.png" width=640>
</center>

Here are the sampled rays from one camera on the top right from camera pov.
<center>
<img src="/images/proj6/onecamtopleft.png" width=640>
</center>

### 3D MLP Neural Network
I had the model forward function take in \`(N, n_samples, 3)\` tensors for both points and direction ray and then flattened the tensors within the forward function such that the Linear Layer can take it as an input. I would then unflatten the tensors after forwarding the inputs through the layers. Lastly, I would unflatten the tensors back into \`(N, n_samples, _)\` tesnors and return it. This simplified some processes and made the code looke cleaner

Here's the structure of the MLP for NeRF.
<center>
<img src="/images/proj6/mlp_nerf.png" width=640>
</center>

### Volumic Rendering
Using the batched densities and color values predicted by the model, as well as the \`dt\` between the \`n_samples\` samples along the ray, we can use volumetric rendering to predict a image coordinate pixel's color values.

We can do so using this discrete approximation of the formula.

$$
\\begin{align}
      \\hat{C}(\\mathbf{r})=\\sum_{i=1}^N T_i\\left(1-\\exp \\left(-\\sigma_i \\delta_i\\right)\\right) \\mathbf{c}_i, \\text { where } T_i=\\exp
      \\left(-\\sum_{j=1}^{i-1} \\sigma_j \\delta_j\\right) \\end{align}
$$

To implement this in code, I used \`torch.cumsum\` to calculated $T_i$ by running getting the cumulative sum of \`dt * densities\` and then subtracting \`densities\` from that cumsum such that we only get the sum up to \`i-1\`. Afterwards, I calculated the main function by multiplying $T_i$ with \`1 - torch.exp(-densities * dt)\` and the \`colors\` passed in. Lastly, I summed up the result using \`torch.sum\` along the \`dim=1\`, to get the sum for each batched image.

## Training The Model

The training loop goes as follows:
1. Sample \`rays_o\`, \`rays_d\`, \`pixels\`
2. Get the sampled \`points\` along \`rays_d\`
3. Pass in \`points\` and \`rays_d\` through the model's forward function
4. Pass in \`pred_densities\` and \`pred_rgb\` from the model's output into the \`volumetric_rendering\` function
5. Compare the \`rgb\` predicted by \`volumetric_rendering\` with the sampled pixels using a loss function
    - I used \`nn.MSELoss\`
6. Backpropogate and optimizer takes gradient step

### Train Loss and PSNR
<center>
<img src="/images/proj6/lego-train-stats.jpg" width=640>
</center>

> I ran 3000 iterations with \`batch_size=30_000\` to achieve \`0.004\` training loss and \`23.435\` training PSNR.

### Validation Loss and PSNR
<center>
<img src="/images/proj6/lego-train-stats.jpg" width=640>
</center>

> I ran 3000 iterations with \`batch_size=30_000\` to achieve \`0.003\` validation loss and \`25.161\` validation PSNR.

> There is probably something still wrong with my training loop, seeing that validation loss is lower than training loss.

### Rendering the Image
Reshape the \`volumetric_rendering(pred_densities, pred_colors, dt)\` output into the original images' dimension to the right corresponding coordinate system.

GPU may run out of memory, so "batch" the rendering process by calculating the predicted rgb values for sections of the image and then concatenating the results afterwards. Be careful to only transpose the image after concatenating everything. I personally did the reconstruction in \`200x20\` batches.

### Validation Image Reconstruction
These are reconstructions of the 0th image of the validation set during different iterations of the training process.

<center>
<table>
    <tr>
        <td align="center">
            <img src="/images/proj6/epoch-0-iter=0-val-0.jpg" width=128 height=128>
            <p>Iteration 0</p>
        </td>
        <td align="center">
            <img src="/images/proj6/epoch-0-iter=100-val-0.jpg" width=128 height=128>
            <p>Iteration 100</p>
        </td>
        <td align="center">
            <img src="/images/proj6/epoch-0-iter=200-val-0.jpg" width=128 height=128>
            <p>Iteration 200</p>
        </td>
    </tr>
    <tr>
        <td align="center">
            <img src="/images/proj6/epoch-0-iter=500-val-0.jpg" width=128 height=128>
            <p>Iteration 500</p>
        </td>
        <td align="center">
            <img src="/images/proj6/epoch-0-iter=700-val-0.jpg" width=128 height=128>
            <p>Iteration 700</p>
        </td>
        <td align="center">
            <img src="/images/proj6/epoch-0-iter=900-val-0.jpg" width=128 height=128>
            <p>Iteration 900</p>
        </td>
    </tr>
    <tr>
        <td align="center">
            <img src="/images/proj6/epoch-3-iter=0-val-0.jpg" width=128 height=128>
            <p>Iteration 3000</p>
        </td>
        <td align="center">
            <img src="/images/proj6/epoch-3-iter=500-val-0.jpg" width=128 height=128>
            <p>Iteration 3500</p>
        </td>
        <td align="center">
            <img src="/images/proj6/epoch-3-iter=900-val-0.jpg" width=128 height=128>
            <p>Iteration 3900</p>
        </td>
    </tr>
</table>
</center>

### Running NeRF on \`c2w\` Test Set
Given a bunch of camera to world coordinate transformation matrices, the model generates the lego CAT.
<center>
<img src="/images/proj6/lego-nerf-test.gif" width=128 height=128>
</center>

## Bells and Whistles

### Depth Perception
This was done by modifying the volumetric perceptron function a bit. Instead of multiplying the equation with predicted rgbs, multiply the equation with \`torch.linspace(1, 0, n_samples)\` to put a near to far weight on the densities on a particular ray direction. Lighter is closer, darker is further.

<center>
<img src="/images/proj6/lego-nerf-test.gif" width=128 height=128> <img src="/images/proj6/lego-nerf-test-depth.gif" width=128 height=128>
</center>

### reflection

I learned a lot on how NeRF works through this project. It was fun yet tough to implement, but I did learn more about stereo correspondence and plenoptic functions. I think I can also increase my PSNR by changing my model architecture to be Tensored based rather than MLP according to this [paper](https://apchenstu.github.io/TensoRF/). I think it is pretty interesting and I probably look into other different architectures and methods to increase PSNR.


`,R=`---
title: Prokudin-Gorskii
date: 2024.9.9
---

## task 1: naive search
I first implemented a naive version of that will align the bgr channels by going through a set range of deltas and then finding then finding the best set of deltas amonst the channels to align with. More specifically, I would align the red and green channels with respect to blue. My initial delta range was \`[-15, 15]\`, and I would use two nested for loops to go through all possible ranges of \`dx\` and \`dy\`. In order to determine whether or not if a certain alignment of g/r to b was the best alignment, I initially used the \`L2 norm squared\` as a loss function, and the "best" metric was calculated by *minimizing* the loss. However after some testing, I found that the \`L2 norm squared\` was not a suitable metric. Therefore, I swtiched to using \`Normalized Cross-Correlation (NCC)\` as the comparison metric, which I found to be more promising. However, note that \`NCC\` is not a loss function but rather a scoring metric that scores the correlation between two vectors, and therefore was a *maximization* problem.

#### \`NCC\` implementation:
1. flatten 2d arrays to 1d arrays for faster computation
2. noramlize the flattened arrays
3. compute dot product of the arrays for metric

#### optimization
Another slight optimization I implemented was to only compute \`np.roll()\` on the input image with respect to \`dx\` in the outside for loop and then doing \`np.roll()\` on the resulting dx rolled image with respect to \`dy\`. That way there will be less computations made.

\`\`\`{python}
for dx:
    #roll dx
    for dy:
        #roll dy
\`\`\`

#### caveats
When I initially implemented this naive search, \`cathedaral.jpg\` and \`tobolsk.jpg\` worked fine. However, \`monastery.jpg\` would have a weird offset between the bgr channels, making the image look like one of those 3d image without looking at them thorugh 3d glasses. I figured that the white/black borders might have affected the NCC metric and therefore resulted in this offsetted result especially since the middle channel doesn't have a top and bottom white border like the other channels. Therefore, I tried cropping the *original* images by \`2.5%\` on all sides before running naive search. This worked in fixing the offsets in between bgr channels in \`monastery.jpg\`.

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj1/task1/cathedral-out.jpg" width=200>
            <p align="middle">cathedral.jpg</p>
        </td>
        <td>
            <img src="/images/proj1/task1/monastery-out.jpg" width=200>
            <p align="middle">monastery.jpg</p>
        </td>
        <td>
            <img src="/images/proj1/task1/tobolsk-out.jpg" width=200>
            <p align="middle">tobolsk.jpg</p>
        </td>
    </tr>
</table>
</div>

|image|red dx|red dy|green dx|green dy|runtime (seconds)|
|-|-|-|-|-|-|
|cathedral.jpg|3|-4|2|-5|0.429
|monastery.jpg|2|-9|2|-9|0.447
|tobolsk.jpg|3|-6|2|-3|0.424

## task 2: pyramid image
I recursively implemented pyramid image processing in order to efficiently process the larger .tif files. Initially I tried to recursively scale down the image by a factor of \`2\`, until I hit the base case, where the image width is less than \`100px\`. Once I hit the base case, I run the naive image \`NCC\` algorithm on it. Afterwards, I would scale the deltas derived form the base case by \`2\` at each recursive layer since the image was initially scaled by a factor of \`2\` at each layer.

### optimizations
In order to optimize the image, I ran the naive alignment algorithm at each recursive layer in order to fine tune results returned from the lower recursive layers. However, the delta range searched at each layer increases by \`2px\` as the recursion proceeds. For example, I would initially use a delta range of \`[-2, 2]\` and by the base case the delta range would be \`[-20, 20]\` if the pyramid image function recursively ran \`9\` times.

### caveats
The images are all scanned differently, and therefore all have different white/black borders sizes. Hence applying a generalized crop percentage for all images doesn't really work.

Initially, I tried using a white mask and diff the white mask with the image in order to eliminate the borders. It was pretty impressive and did get rid of the borders. However, a problem arose where the cropped images of the bgr channels were all in different dimensions and was hard to manipulate afterwards to the mismatch in dimensions.

Therefore, I ended up switching to using generalized percentage cropping. I cropped the *initial* image (when it still contains 3 images) by \`2%\` of its height and \`5%\` of its width on each side. This is due to the borders only being from the initial image. If I cropped each individual image after dividing the initial image into 3 pieces, I would get weird crops since the middle channel image wouldn't have white/black borders on the top and bottom.

However, this set of crop dimension didn't work for \`emir.tif\` and \`lady.tif\`. After some fine tuning, I found specific crop percentages for each image. For \`emir.tif\`, the crop dimensions were \`1.5%\` of the height on both sides, \`4%\` of the left side and \`2%\` on the right side. And for \`lady.tif\`, the crop dimensions were \`3%\` of the height and \`5%\` of the width on each side.

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj1/task2/cathedral.jpg" width=128>
            <p align="middle">cathedral.jpg</p>
        </td>
        <td>
            <img src="/images/proj1/task2/church.jpg" width=128>
            <p align="middle">church.jpg</p>
        </td>
        <td>
            <img src="/images/proj1/task2/emir.jpg" width=128>
            <p align="middle">emir.jpg</p>
        </td>
        <td>
            <img src="/images/proj1/task2/harvesters.jpg" width=128>
            <p align="middle">harvesters.jpg</p>
        </td>
    </tr>
    <tr>
        <td>
            <img src="/images/proj1/task2/icon.jpg" width=128>
            <p align="middle">icon.jpg</p>
        </td>
        <td>
            <img src="/images/proj1/task2/lady.jpg" width=128>
            <p align="middle">lady.jpg</p>
        </td>
        <td>
            <img src="/images/proj1/task2/melons.jpg" width=128>
            <p align="middle">melons.jpg</p>
        </td>
        <td>
            <img src="/images/proj1/task2/monastery.jpg" width=128>
            <p align="middle">monastery.jpg</p>
        </td>
    </tr>
    <tr>
        <td>
            <img src="/images/proj1/task2/onion_church.jpg" width=128>
            <p align="middle">onion_church.jpg</p>
        </td>
        <td>
            <img src="/images/proj1/task2/sculpture.jpg" width=128>
            <p align="middle">sculpture.jpg</p>
        </td>
        <td>
            <img src="/images/proj1/task2/self_portrait.jpg" width=128>
            <p align="middle">self_portrait.jpg</p>
        </td>
        <td>
            <img src="/images/proj1/task2/three_generations.jpg" width=128>
            <p align="middle">three_generations.jpg</p>
        </td>
    </tr>
    <tr>
    </tr>
    <tr>
        <td></td>
        <td>
            <img src="/images/proj1/task2/tobolsk.jpg" width=128>
            <p align="middle">tobolsk.jpg</p>
        </td>
        <td>
            <img src="/images/proj1/task2/train.jpg" width=128>
            <p align="middle">train.jpg</p>
        </td>
        <td></td>
    </tr>
</table>
</div>

|image|red dx|red dy|green dx|green dy|runtime (seconds)|
|-|-|-|-|-|-|
|cathedral.jpg|3|-14|2|-8|0.044
|church.jpg|-4|-197|0|-104|4.722
|emir.jpg|41|-89|23|-47|5.253
|harvesters.jpg|13|-131|16|-68|5.085
|icon.jpg|23|-170|17|-89|5.555
|lady.jpg|10|-265|8|-135|5.005
|melons.jpg|12|-78|8|-47|5.115
|monastery.jpg|2|-23|2|-16|0.039
|onion_church.jpg|36|-148|26|-76|5.026
|sculpture.jpg|-26|-121|-11|-97|5.414
|self_potrait.jpg|35|-85|26|-54|5.309
|three_generations.jpg|9|-143|11|-74|5.322
|tobolsk.jpg|3|-20|3|-10|0.040
|train.jpg|32|-169|5|-86|4.905

## bonus: auto contrast
I tried restoring some of the contrast of the images by equalizing the normalized distribution of the pixel values of each channel. I attempted to manually implement ["Contrast Limited AHE" (CLAHE)](https://en.wikipedia.org/wiki/Adaptive_histogram_equalization). Shadows and some colors became more apparent after the contrast adjustment.

<div align="middle">
<table>
    <tr>
        <td>
            <img src="/images/proj1/extras/contrast/cathedral.jpg" width=128>
            <p align="middle">cathedral.jpg</p>
        </td>
        <td>
            <img src="/images/proj1/extras/contrast/church.jpg" width=128>
            <p align="middle">church.jpg</p>
        </td>
        <td>
            <img src="/images/proj1/extras/contrast/emir.jpg" width=128>
            <p align="middle">emir.jpg</p>
        </td>
        <td>
            <img src="/images/proj1/extras/contrast/harvesters.jpg" width=128>
            <p align="middle">harvesters.jpg</p>
        </td>
    </tr>
    <tr>
        <td>
            <img src="/images/proj1/extras/contrast/icon.jpg" width=128>
            <p align="middle">icon.jpg</p>
        </td>
        <td>
            <img src="/images/proj1/extras/contrast/lady.jpg" width=128>
            <p align="middle">lady.jpg</p>
        </td>
        <td>
            <img src="/images/proj1/extras/contrast/melons.jpg" width=128>
            <p align="middle">melons.jpg</p>
        </td>
        <td>
            <img src="/images/proj1/extras/contrast/monastery.jpg" width=128>
            <p align="middle">monastery.jpg</p>
        </td>
    </tr>
    <tr>
        <td>
            <img src="/images/proj1/extras/contrast/onion_church.jpg" width=128>
            <p align="middle">onion_church.jpg</p>
        </td>
        <td>
            <img src="/images/proj1/extras/contrast/sculpture.jpg" width=128>
            <p align="middle">sculpture.jpg</p>
        </td>
        <td>
            <img src="/images/proj1/extras/contrast/self_portrait.jpg" width=128>
            <p align="middle">self_portrait.jpg</p>
        </td>
        <td>
            <img src="/images/proj1/extras/contrast/three_generations.jpg" width=128>
            <p align="middle">three_generations.jpg</p>
        </td>
    </tr>
    <tr>
    </tr>
    <tr>
        <td></td>
        <td>
            <img src="/images/proj1/extras/contrast/tobolsk.jpg" width=128>
            <p align="middle">tobolsk.jpg</p>
        </td>
        <td>
            <img src="/images/proj1/extras/contrast/train.jpg" width=128>
            <p align="middle">train.jpg</p>
        </td>
        <td></td>
    </tr>
</table>
</div>
`;function f(t){const n=t.split(`
`),r={};let s=0;if(n[0]?.trim()==="---")for(let i=1;i<n.length;i++){if(n[i].trim()==="---"){s=i+1;break}const a=n[i].indexOf(":");if(a!==-1){const o=n[i].slice(0,a).trim(),y=n[i].slice(a+1).trim();r[o]=y}}return{data:r,content:n.slice(s).join(`
`).trim()}}function q(t){const n=t.split("/");return n[n.length-1].replace(/\.md$/,"")}const j=Object.assign({"/content/misc/first-post.md":P,"/content/projects/diffusion.md":L,"/content/projects/face-morph.md":M,"/content/projects/filters-and-frequencies.md":C,"/content/projects/image-stitching.md":F,"/content/projects/nerf.md":D,"/content/projects/prokudin-gorskii.md":R});function w(t,n){const r=[];for(const[s,i]of Object.entries(j)){if(!s.startsWith(`/content/${t}/`))continue;const{data:a}=f(i),o=q(s);r.push({title:a.title??o,date:a.date??"",slug:o})}return r.sort((s,i)=>{const a=new Date(s.date.replace(/\./g,"-")).getTime();return new Date(i.date.replace(/\./g,"-")).getTime()-a}),r}function b(t,n){const r=`/content/${t}/${n}.md`,s=j[r];if(!s)return;const{data:i,content:a}=f(s);return{title:i.title??n,date:i.date??"",slug:n,content:a}}function U(t){return w("projects")}function B(t){return b("projects",t)}function E(t){return w("misc")}function G(t){return b("misc",t)}function W(){const t=U();return e.jsxs("div",{className:"content",children:[e.jsx("header",{className:"mb-4",children:e.jsx("h1",{children:"Projects"})}),e.jsx("hr",{}),e.jsx("div",{className:"text-sm",children:e.jsx("ul",{className:"space-y-1",children:t.map(n=>e.jsx("li",{children:e.jsx(g,{to:`/projects/${n.slug}`,className:"hover:underline",children:n.title})},n.slug))})})]})}function O(){const{slug:t}=l(),n=t?B(t):void 0;return n?e.jsxs("div",{className:"content",children:[e.jsx("div",{className:"post",children:e.jsx("h1",{className:"title",children:n.title})}),e.jsx("hr",{}),e.jsx("article",{className:"prose prose-zinc dark:prose-invert mt-4",children:e.jsx(p,{remarkPlugins:[h,u],rehypePlugins:[m,c],children:n.content})}),e.jsx("br",{})]}):e.jsxs("div",{className:"content",children:[e.jsx("header",{className:"mb-4",children:e.jsx("h1",{children:"Project not found"})}),e.jsx("hr",{}),e.jsx("p",{className:"text-sm text-zinc-500",children:e.jsx(g,{to:"/projects",className:"hover:underline",children:"Back to projects"})})]})}function V(){const t=E();return e.jsxs("div",{className:"content",children:[e.jsx("header",{className:"mb-4",children:e.jsx("h1",{children:"Misc."})}),e.jsx("hr",{}),e.jsx("div",{className:"text-sm",children:e.jsx("ul",{className:"space-y-1",children:t.map(n=>e.jsx("li",{children:e.jsx(g,{to:`/misc/${n.slug}`,className:"hover:underline",children:n.title})},n.slug))})})]})}function K(){const{slug:t}=l(),n=t?G(t):void 0;return n?e.jsxs("div",{className:"content",children:[e.jsx("div",{className:"post",children:e.jsx("h1",{className:"title",children:n.title})}),e.jsx("hr",{}),e.jsx("article",{className:"prose prose-zinc dark:prose-invert mt-4",children:e.jsx(p,{remarkPlugins:[h,u],rehypePlugins:[m,c],children:n.content})}),e.jsx("br",{})]}):e.jsxs("div",{className:"content",children:[e.jsx("header",{className:"mb-4",children:e.jsx("h1",{children:"Post not found"})}),e.jsx("hr",{}),e.jsx("p",{className:"text-sm text-zinc-500",children:e.jsx(g,{to:"/misc",className:"hover:underline",children:"Back to misc"})})]})}function X(){return e.jsxs("div",{className:"content",children:[e.jsx("header",{className:"mb-4",children:e.jsx("h1",{children:"Invalid URL"})}),e.jsx("hr",{}),e.jsx("p",{className:"text-sm text-zinc-500",children:e.jsx(g,{to:"/",className:"hover:underline",children:"Back to home"})})]})}function Z(){return e.jsx(S,{children:e.jsxs(v,{children:[e.jsx(d,{path:"/",element:e.jsx(x,{to:"/home",replace:!0})}),e.jsx(d,{path:"/home",element:e.jsx(H,{})}),e.jsx(d,{path:"/projects",element:e.jsx(W,{})}),e.jsx(d,{path:"/projects/:slug",element:e.jsx(O,{})}),e.jsx(d,{path:"/misc",element:e.jsx(V,{})}),e.jsx(d,{path:"/misc/:slug",element:e.jsx(K,{})}),e.jsx(d,{path:"/*",element:e.jsx(X,{})})]})})}_.createRoot(document.getElementById("root")).render(e.jsx(I.StrictMode,{children:e.jsx(N,{children:e.jsx(Z,{})})}));
